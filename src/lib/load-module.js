export default async function loadModule (loader) {
  const module = await loader
  return module.default
}
