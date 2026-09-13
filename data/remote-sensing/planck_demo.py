"""Blackbody wavelength spectra. Standard library only; not an LST retrieval.

Run: python planck_demo.py --output-dir planck-output
Output units: wavelength in um; radiance in W m^-2 sr^-1 um^-1.
Teaching reference: https://cimss.ssec.wisc.edu/wxwise/class/aos340/labs/lab2/lab2.html
Independent implementation using exact SI h, c and k_B constants.
"""
import argparse
import csv
import math
from pathlib import Path

H = 6.62607015e-34  # J s
C = 299792458.0  # m s^-1
K_B = 1.380649e-23  # J K^-1


def planck(wavelength_um, temperature_k):
    """Vacuum blackbody spectral radiance per micrometre, wavelength form."""
    if not (math.isfinite(wavelength_um) and math.isfinite(temperature_k)):
        raise ValueError("Wavelength and temperature must be finite")
    if wavelength_um <= 0 or temperature_k <= 0:
        raise ValueError("Wavelength and absolute temperature must be positive")
    wavelength_m = wavelength_um * 1e-6
    exponent = H * C / (wavelength_m * K_B * temperature_k)
    if exponent > 700:
        return 0.0  # Shortwave Wien tail below useful numerical precision here.
    radiance_per_m = 2 * H * C**2 / wavelength_m**5 / math.expm1(exponent)
    return radiance_per_m * 1e-6


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", type=Path, default=Path("planck-output"))
    args = parser.parse_args()
    # Numerical reference and limiting/monotonic behaviour checks.
    assert math.isclose(planck(10, 300), 9.92403333, rel_tol=1e-8)
    assert planck(10, 250) < planck(10, 300) < planck(10, 350)
    wavelengths = [2 + i / 100 for i in range(2801)]
    args.output_dir.mkdir(parents=True, exist_ok=True)
    for temperature in (250, 300, 350):
        radiances = [planck(wavelength, temperature) for wavelength in wavelengths]
        peak = wavelengths[max(range(len(radiances)), key=radiances.__getitem__)]
        expected_peak = 2897.771955 / temperature  # Wavelength-domain Wien law, um K.
        assert abs(peak - expected_peak) <= 0.011
        output = args.output_dir / f"planck-{temperature}K.csv"
        with output.open("w", newline="", encoding="utf-8") as handle:
            writer = csv.writer(handle)
            writer.writerow(["wavelength_um", "radiance_W_m-2_sr-1_um-1", "temperature_K"])
            writer.writerows((f"{wavelength:.2f}", f"{radiance:.12g}", temperature)
                             for wavelength, radiance in zip(wavelengths, radiances))
        print(f"{temperature} K: peak {peak:.2f} um, B(10 um) {planck(10, temperature):.6f}; {output}")
    print("Checks passed. No emissivity, atmosphere or sensor response is included.")


if __name__ == "__main__":
    main()
