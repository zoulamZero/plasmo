import { vLog } from "@plasmo/utils/logging"

import type { BackgroundMessage, ExtensionApi, RuntimeData } from "../types"

// @ts-ignore
export const runtimeData = __plasmo_runtime_data__ as RuntimeData

module.bundle.HMR_BUNDLE_ID = runtimeData.bundleId

globalThis.process = {
  argv: [],
  env: {
    VERBOSE: runtimeData.verbose
  }
} as any

const OldModule = module.bundle.Module

function Module(moduleName) {
  OldModule.call(this, moduleName)
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {})
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn)
    }
  }
  module.bundle.hotData = undefined
}

module.bundle.Module = Module

export const extCtx: ExtensionApi =
  globalThis.chrome || globalThis.browser || null

export async function triggerReload(fullReload = false) {
  if (fullReload) {
    vLog("Triggering full reload")
    extCtx.runtime.sendMessage<BackgroundMessage>({
      __plasmo_full_reload__: true
    })
  }

  if (globalThis.location !== undefined && "reload" in globalThis.location) {
    globalThis.location.reload()
  }
}

export function getHostname() {
  return (
    runtimeData.host ||
    (location.protocol.indexOf("http") === 0 ? location.hostname : "localhost")
  )
}

export function getPort() {
  return runtimeData.port || location.port
}
