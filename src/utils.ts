export const GENERIC_SPLIT_KEY = '['

// 是否是接口类型
export const isGenerics = (s: string) => /^.+\[.+\]$/.test(s)

/**
 * 分解泛型接口
 * @param definitionClassName
 */
export function getGenericsClassNames(definitionClassName: string) {
  const splitIndex = definitionClassName.indexOf(GENERIC_SPLIT_KEY)
  // 泛型基类 PagedResultDto
  const interfaceClassName = definitionClassName.slice(0, splitIndex)
  // 泛型类型 T 的类型名称
  const TClassName = definitionClassName.slice(splitIndex + 1, -1)
  return { interfaceClassName, TClassName }
}

/**
 * 获取引用类型
 * @param s
 */
export function refClassName(s: string) {
  let propType = s.slice(s.lastIndexOf('/') + 1)
  if (isGenerics(propType)) {
    const { interfaceClassName, TClassName } = getGenericsClassNames(propType)
    // return `${interfaceClassName}<${toBaseType(TClassName)}>`
    return trimString(propType.replace(/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/g, '_'), '_', 'right')
  } else {
    return propType
  }
}

export function toBaseType(s: string) {
  if (s === undefined || s === null || s.length === 0) {
    return 'any | null'
  }
  let result = ''
  switch (s) {
    case 'array':
      result = '[]'
      break
    case 'Int64':
    case 'integer':
      result = 'number'
      break
    case 'Guid':
    case 'String':
    case 'string':
      result = 'string'
      break
    case 'file':
      result = 'any'
      break
    default:
      result = s
      break
  }
  return result
}

export function getMethodName(path: string) {
  const paths = path.split('/')
  for (let i = paths.length - 1; i >= 0; i--) {
    if (/\{.+\}/.test(paths[i]) === false) {
      return paths[i]
    }
  }
  return ''
}


export function trimString(str: string, char: string, type: string) {
  if (char) {
    if (type == 'left') {
      return str.replace(new RegExp('^\\' + char + '+', 'g'), '');
    } else if (type == 'right') {
      return str.replace(new RegExp('\\' + char + '+$', 'g'), '');
    }
    return str.replace(new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'), '');
  }
  return str.replace(/^\s+|\s+$/g, '');
};
