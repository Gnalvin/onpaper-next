import type { configType } from '@/components/input/type'

type registerRulesKey = 'phone' | 'password' | 'verifyCode' | 'inviteCode'
type loginRulesRulesKey = 'account' | 'password'
type emailLoginRulesKey = 'email' | 'password' | 'verifyCode'

export const loginRules: Record<loginRulesRulesKey, configType> = {
  account: {
    require: {
      must: true,
      message: '请输入账号'
    },
    // 失去焦点时验证
    blur: {
      verifyAll: false,
      pattern: [
        // 邮箱/手机号
        {
          // eslint-disable-next-line no-useless-escape
          rule: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
          message: '请输入正确的账号'
        },
        {
          rule: /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[0-35-9]\d{2}|4(?:0\d|1[0-2]|9\d))|9[0-35-9]\d{2}|6[2567]\d{2}|4[579]\d{2})\d{6}$/,
          message: '请输入正确的账号'
        }
      ]
    }
  },
  password: {
    require: {
      must: true,
      message: '请输入密码'
    },
    // 主动调用验证函数时
    call: {
      verifyAll: true,
      pattern: [
        {
          rule: /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{9,16}$/,
          message: '账号或密码错误'
        }
      ]
    }
  }
}

export const registerRules: Record<registerRulesKey, configType> = {
  phone: {
    // 要求必传
    require: {
      must: true,
      message: '请输入手机号'
    },
    // 失去焦点时验证
    blur: {
      verifyAll: true,
      pattern: [
        {
          rule: /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[0-35-9]\d{2}|4(?:0\d|1[0-2]|9\d))|9[0-35-9]\d{2}|6[2567]\d{2}|4[579]\d{2})\d{6}$/,
          message: '请输入正确的手机号'
        }
      ]
    }
  },
  password: {
    require: {
      must: true,
      message: '请输入密码'
    },
    // 主动调用验证函数时
    blur: {
      verifyAll: true,
      pattern: [
        {
          rule: /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{9,16}$/,
          message: '密码不符合要求'
        }
      ]
    }
  },
  verifyCode: {
    require: {
      must: true,
      message: '请输入验证码'
    },
    blur: {
      verifyAll: true,
      pattern: [
        {
          rule: /^\d{6}$/,
          message: '请输入6位验证码'
        }
      ]
    }
  },
  inviteCode: {
    require: {
      must: true,
      message: '请输入邀请码'
    },
    blur: {
      verifyAll: true,
      pattern: [
        {
          rule: /^[a-zA-Z0-9]{7}$/,
          message: '请输入7位邀请码'
        }
      ]
    }
  }
}

export const emailLoginRules: Record<emailLoginRulesKey, configType> = {
  email: {
    require: {
      must: true,
      message: '请输入邮箱地址'
    }, // 要求必传
    // 失去焦点时验证
    blur: {
      verifyAll: true,
      pattern: [
        {
          // eslint-disable-next-line no-useless-escape
          rule: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
          message: '请输入正确的邮箱地址' // 错误提示
        }
      ]
    }
  },
  password: {
    require: {
      must: true,
      message: '请输入密码'
    },
    // 主动调用验证函数时
    blur: {
      verifyAll: true,
      pattern: [
        {
          rule: /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{9,16}$/,
          message: '密码强度不足'
        }
      ]
    }
  },
  verifyCode: {
    require: {
      must: true,
      message: '请输入验证码'
    },
    blur: {
      verifyAll: true,
      pattern: [
        {
          rule: /^\d{6}$/,
          message: '请输入6位验证码'
        }
      ]
    }
  }
}
