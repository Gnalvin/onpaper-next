import type { App } from 'vue'
import registerDirectives from './register-directive'
import registerProperties from './register-properties'

export function registerApp(app: App): void {
  registerDirectives(app)
  registerProperties(app)
}
