"""Numerical examples accompanying the 12 research articles (Python 3 stdlib).

Run: python research_demos.py --output-dir results
All inputs are synthetic. No satellite files, 6S, PROSAIL or SMAP ATBD code
are run. Outputs retain units; assertions check analytic and limiting cases.
"""
import argparse
import csv
import math
from pathlib import Path

H, C, KB = 6.62607015e-34, 299792458.0, 1.380649e-23

def planck(wavelength_um, temperature_k):
    wavelength_m = wavelength_um * 1e-6
    return 2 * H * C**2 / wavelength_m**5 / math.expm1(H*C/(wavelength_m*KB*temperature_k)) * 1e-6

def brightness_temperature(wavelength_um, radiance_per_um):
    wavelength_m = wavelength_um * 1e-6
    radiance_per_m = radiance_per_um * 1e6
    return H*C/(wavelength_m*KB*math.log1p(2*H*C**2/(wavelength_m**5*radiance_per_m)))

def surface_reflectance(toa, path, transmission_product, spherical_albedo):
    delta = toa - path
    return delta / (transmission_product + spherical_albedo * delta)

def vegetation_tb(reflectivity, soil_k, vegetation_k, tau_v, omega, theta_deg):
    """Homogeneous tau-omega teaching model; omits sky and atmosphere."""
    gamma = math.exp(-tau_v / math.cos(math.radians(theta_deg)))
    return (1-reflectivity)*gamma*soil_k + (1-omega)*(1-gamma)*(1+reflectivity*gamma)*vegetation_k

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", default="results")
    output = Path(parser.parse_args().output_dir)
    output.mkdir(parents=True, exist_ok=True)
    rows = []
    def record(topic, name, value, unit):
        rows.append((topic, name, value, unit))

    toa = 2 + math.exp(-0.2)*10
    record("atmosphere", "toa_radiance", toa, "W m-2 sr-1 um-1")
    record("atmosphere", "surface_ignoring_path", toa/math.exp(-0.2), "W m-2 sr-1 um-1")
    assert math.isclose((toa-2)/math.exp(-0.2), 10)
    rho = surface_reflectance(0.2, 0.04, 0.72, 0.1)
    assert math.isclose(0.04+0.72*rho/(1-0.1*rho), 0.2)
    assert surface_reflectance(0.2, 0, 1, 0) == 0.2
    record("reflectance", "surface_reflectance", rho, "1")
    record("reflectance", "surface_ignoring_path", surface_reflectance(0.2, 0, 0.72, 0.1), "1")
    record("reflectance", "landsat_c2_sr_dn20000", 20000*0.0000275-0.2, "1")

    blackbody = planck(10, 300)
    thermal_toa = 0.8*(0.95*blackbody+0.05*5)+1
    recovered_blackbody = ((thermal_toa-1)/0.8-0.05*5)/0.95
    record("thermal", "toa_radiance", thermal_toa, "W m-2 sr-1 um-1")
    record("thermal", "toa_brightness_temperature", brightness_temperature(10, thermal_toa), "K")
    record("thermal", "corrected_temperature", brightness_temperature(10, recovered_blackbody), "K")
    assert math.isclose(brightness_temperature(10, recovered_blackbody), 300, abs_tol=1e-10)
    assert brightness_temperature(10, thermal_toa) < 300
    record("thermal", "landsat_c2_st_dn45000", 45000*0.00341802+149, "K")
    for kelvin in (200, 250, 300, 350):
        for um in (8, 10, 12):
            assert math.isclose(brightness_temperature(um, planck(um, kelvin)), kelvin, abs_tol=1e-9)

    for dielectric in (4, 16):
        reflectivity = ((1-math.sqrt(dielectric))/(1+math.sqrt(dielectric)))**2
        record("fresnel", f"normal_power_reflectivity_eps{dielectric}", reflectivity, "1")
        assert 0 <= reflectivity <= 1
    for tau in (0, 0.2, 1, 10):
        tb = vegetation_tb(0.2, 300, 300, tau, 0, 40)
        record("vegetation", f"brightness_tau{tau}", tb, "K")
    assert vegetation_tb(0.2, 300, 300, 0, 0, 40) == 240
    assert math.isclose(vegetation_tb(0.2, 300, 300, 100, 0, 40), 300)

    record("canopy", "gap_lai3_sza30", math.exp(-0.5*3/math.cos(math.radians(30))), "1")
    for red, nir in ((0.05, 0.45), (0.025, 0.225), (0.10, 0.50)):
        record("canopy", f"ndvi_red{red}_nir{nir}", (nir-red)/(nir+red), "1")
    for angle in (0, 45, 90, 135, 180):
        q, u = math.cos(math.radians(2*angle)), math.sin(math.radians(2*angle))
        assert math.isclose(q*q+u*u, 1)
        record("stokes", f"Q_angle{angle}", q, "normalized intensity")
        record("stokes", f"U_angle{angle}", u, "normalized intensity")

    prior_variance, obs_variance = 0.04**2, 0.03**2
    gain = prior_variance/(prior_variance+obs_variance)
    posterior = 0.20+gain*(0.30-0.20)
    posterior_std = math.sqrt((1-gain)*prior_variance)
    assert math.isclose(posterior, 0.264)
    assert math.isclose(posterior_std, 0.024)
    assert posterior_std < min(0.04, 0.03)
    record("inversion", "posterior_moisture", posterior, "m3 m-3")
    record("inversion", "posterior_standard_deviation", posterior_std, "m3 m-3")
    weighted = sum(x*w for x, w in zip((2,10,2), (1,2,1)))/4
    assert weighted == 6
    record("sensor", "three_point_band_average", weighted, "synthetic radiance unit")
    with (output / "examples.csv").open("w", newline="", encoding="utf-8") as stream:
        writer = csv.writer(stream)
        writer.writerow(("topic", "quantity", "value", "unit"))
        writer.writerows(rows)
    print(f"{len(rows)} quantities written; analytic, inverse, energy-range and limiting checks passed.")

if __name__ == "__main__":
    main()
