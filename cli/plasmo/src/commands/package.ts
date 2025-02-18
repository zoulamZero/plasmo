import { iLog } from "@plasmo/utils/logging"

import { getBundleConfig } from "~features/extension-devtools/get-bundle-config"
import { printHeader } from "~features/helpers/print"
import { createManifest } from "~features/manifest-factory/create-manifest"
import { zipBundle } from "~features/manifest-factory/zip"

async function packageCmd() {
  printHeader()

  process.env.NODE_ENV = "production"

  iLog("Prepare to package the extension bundle...")

  const bundleConfig = getBundleConfig()

  const plasmoManifest = await createManifest(bundleConfig)

  await zipBundle(plasmoManifest.commonPath)
}

export default packageCmd
