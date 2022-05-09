
# imports
import micropip

await micropip.install('xarray')
# await micropip.install('requests')
# await micropip.install('aiohttp')
await micropip.install('fsspec')
# await micropip.install('gcsfs')
package_list = micropip.list()
print(package_list)

# import fsspec
import xarray as xr
# import aiohttp
# import fsspec
# import zarr
# import gcsfs

# This is a public dataset that could benefit from the new features
# url = "https://storage.googleapis.com/dgds-data-public/data/Population_exposed.zarr"
# ds = xr.open_dataset(url, engine="zarr")

slr_check = xr.open_dataset(url)
print(slr_check)
a = 'test'
print(url)
# print(ds.Scenario.values)

# selection = ds.Pop_exposed.sel(Percentile=50, Scenario='rcp45', Population="present", Region="SAH")

# print(selection.Region.values)

# region_id = 20
# scenario_id = 1
# population_id = 0

# lb = slr_check.isel(
#     Region=region_id, Percentile=0, Scenario=scenario_id, Population=population_id
# )["Pop_exposed"]
# mean = slr_check.isel(
#     Region=region_id, Percentile=1, Scenario=scenario_id, Population=0
# )["Pop_exposed"]
# ub = slr_check.isel(
#     Region=region_id, Percentile=2, Scenario=scenario_id, Population=population_id
# )["Pop_exposed"]
