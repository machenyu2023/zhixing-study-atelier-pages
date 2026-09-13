"""Small standard-library demonstrations for the remote-sensing physics library.

These are teaching forward models, not satellite retrieval algorithms. Run:
  python physics_demos.py --demo all --output-dir physics-output
Outputs use SI-derived units and CSV files so they can be inspected directly.
"""
import argparse
import csv
import math
from pathlib import Path


def write_csv(path, header, rows):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle)
        writer.writerow(header)
        writer.writerows(rows)


def radiometry_demo(output_dir):
    """Numerically integrate constant radiance over a receiving hemisphere."""
    radiance = 5.0  # W m^-2 sr^-1
    n_theta, n_phi = 180, 360
    total = 0.0
    for i in range(n_theta):
        theta = (i + 0.5) * (math.pi / 2) / n_theta
        for j in range(n_phi):
            dphi = 2 * math.pi / n_phi
            dtheta = (math.pi / 2) / n_theta
            total += radiance * math.cos(theta) * math.sin(theta) * dtheta * dphi
    expected = math.pi * radiance
    assert abs(total - expected) < 2e-3
    write_csv(output_dir / "radiometry-hemisphere.csv",
              ["radiance_W_m-2_sr-1", "irradiance_W_m-2", "analytic_pi_L"],
              [[f"{radiance:.8g}", f"{total:.12g}", f"{expected:.12g}"]])
    print(f"radiometry: E={total:.8f} W m^-2, πL={expected:.8f} W m^-2")


def atmosphere_demo(output_dir):
    """Compare pure transmission with a path-radiance toy model."""
    surface = 12.0  # W m^-2 sr^-1 um^-1
    rows = []
    for optical_depth in [0.0, 0.25, 0.5, 1.0, 2.0, 4.0]:
        transmittance = math.exp(-optical_depth)
        for path_radiance in [0.0, 1.0]:
            toa = transmittance * surface + path_radiance
            rows.append([f"{optical_depth:.3g}", f"{transmittance:.12g}",
                         f"{path_radiance:.3g}", f"{toa:.12g}"])
    assert rows[0][-1] == "12"
    assert float(rows[-1][-1]) > 0.0
    write_csv(output_dir / "atmosphere-transmission.csv",
              ["optical_depth", "transmittance", "path_radiance_W_m-2_sr-1_um-1",
               "toa_radiance_W_m-2_sr-1_um-1"], rows)
    print("atmosphere: generated Beer-Lambert plus path-radiance grid")


def brdf_demo(output_dir):
    """Compare a Lambertian term with a simple directional lobe."""
    rho = 0.3
    rows = []
    for view_deg in range(0, 86, 5):
        view = math.radians(view_deg)
        lambert = rho / math.pi
        # Deliberately simple teaching lobe; it is not a fitted BRDF model.
        specular_lobe = 0.18 * math.exp(-((view - math.radians(25)) / math.radians(10)) ** 2)
        brdf = lambert + specular_lobe
        rows.append([view_deg, f"{lambert:.12g}", f"{specular_lobe:.12g}", f"{brdf:.12g}"])
    assert all(float(row[1]) > 0 for row in rows)
    assert max(float(row[3]) for row in rows) > float(rows[0][3])
    write_csv(output_dir / "brdf-directionality.csv",
              ["view_zenith_deg", "lambertian_brdf_sr-1", "directional_lobe_sr-1",
               "teaching_brdf_sr-1"], rows)
    print("brdf: generated Lambertian and directional-lobe comparison")


def microwave_demo(output_dir):
    """Map a toy soil-moisture dielectric parameterization to H-pol TB."""
    theta = math.radians(40)
    temperature = 300.0  # K
    rows = []
    for moisture in [i / 100 for i in range(0, 51, 5)]:
        epsilon = 3.0 + 20.0 * moisture
        root = math.sqrt(max(epsilon - math.sin(theta) ** 2, 1e-12))
        reflectivity = ((math.cos(theta) - root) / (math.cos(theta) + root)) ** 2
        emissivity = 1.0 - reflectivity
        brightness = emissivity * temperature
        rows.append([f"{moisture:.3g}", f"{epsilon:.8g}", f"{reflectivity:.12g}",
                     f"{emissivity:.12g}", f"{brightness:.12g}"])
    assert float(rows[-1][-1]) < float(rows[0][-1])
    write_csv(output_dir / "microwave-soil-moisture.csv",
              ["volumetric_moisture", "epsilon_real", "h_reflectivity_linear",
               "h_emissivity", "brightness_temperature_K"], rows)
    print("microwave: generated toy dielectric-to-brightness-temperature curve")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--demo", choices=["all", "radiometry", "atmosphere", "brdf", "microwave"], default="all")
    parser.add_argument("--output-dir", type=Path, default=Path("physics-output"))
    args = parser.parse_args()
    demos = {
        "radiometry": radiometry_demo,
        "atmosphere": atmosphere_demo,
        "brdf": brdf_demo,
        "microwave": microwave_demo,
    }
    selected = demos.values() if args.demo == "all" else [demos[args.demo]]
    for demo in selected:
        demo(args.output_dir)
    print("Checks passed. These are simplified teaching models without satellite validation.")


if __name__ == "__main__":
    main()
