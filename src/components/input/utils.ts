import type { rule, requireType } from './type'
/**
 *
 * 其中结果  验证所有
 * true     true       继续验证      情况1
 * true     false      pass 通过     情况2
 * false    true       直接返回错误   情况3
 * false    false      继续验证       情况4
 */
export function verify(text: string, rule?: rule, require?: requireType) {
  let verify = false
  let message = ''
  //验证是否必传
  if (require?.must) {
    if (text.length === 0) {
      return require.message
    }
  }
  if (!rule) return ''
  // 逐一验证规则
  for (const r of rule.pattern) {
    verify = r.rule.test(text)
    message = r.message

    if (verify && !rule.verifyAll) break //情况2
    if (!verify && rule.verifyAll) break //情况3
  }

  return verify ? '' : message
}
