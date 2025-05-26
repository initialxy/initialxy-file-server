export function emptyFunc(): void {}

export function chunk<T>(arr: T[], size: number): T[][] {
  const res: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size))
  }
  return res
}

export function first<T>(arr?: T[]): T | null {
  return arr != null && arr.length > 0 ? arr[0] : null
}

export function isIOS(): boolean {
  return (
    /iPad|iPhone|iPod/.test(navigator.platform) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}
