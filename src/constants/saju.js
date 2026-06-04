// ── 사주 기본 계산 (연 천간/지지 기준 — 혼합형의 base 점수용) ──────────

// 천간 10개 → 오행 매핑 (갑을목 · 병정화 · 무기토 · 경신금 · 임계수)
export const STEM_NAMES   = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계']
export const STEM_ELEMENT = ['mok', 'mok', 'hwa', 'hwa', 'to', 'to', 'geum', 'geum', 'su', 'su']

// 지지 12개 → 띠 / 오행 (인묘목 · 사오화 · 진술축미토 · 신유금 · 해자수)
export const BRANCH_NAMES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해']
export const ZODIAC       = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지']
export const BRANCH_ELEMENT = ['su', 'to', 'mok', 'mok', 'to', 'hwa', 'hwa', 'to', 'geum', 'geum', 'to', 'su']

const mod = (n, m) => ((n % m) + m) % m

export const yearStemIndex   = (year) => mod(year - 4, 10)
export const yearBranchIndex = (year) => mod(year - 4, 12)

export const yearElement = (year) => STEM_ELEMENT[yearStemIndex(year)]
export const yearStem    = (year) => STEM_NAMES[yearStemIndex(year)]
export const zodiacOf    = (year) => ZODIAC[yearBranchIndex(year)]

// 태어난 달 → 계절 오행 (봄목 · 여름화 · 가을금 · 겨울수 · 환절기토)
export const monthElement = (month) => {
  if ([2, 3, 4].includes(month))  return 'mok'
  if ([5, 6, 7].includes(month))  return 'hwa'
  if ([8, 9, 10].includes(month)) return 'geum'
  if ([11, 12, 1].includes(month)) return 'su'
  return 'to'
}

// 12시진 (태어난 시간대) → 지지 오행
export const TIME_SLOTS = [
  { label: '자시 (23:00~01:00)', el: 'su' },
  { label: '축시 (01:00~03:00)', el: 'to' },
  { label: '인시 (03:00~05:00)', el: 'mok' },
  { label: '묘시 (05:00~07:00)', el: 'mok' },
  { label: '진시 (07:00~09:00)', el: 'to' },
  { label: '사시 (09:00~11:00)', el: 'hwa' },
  { label: '오시 (11:00~13:00)', el: 'hwa' },
  { label: '미시 (13:00~15:00)', el: 'to' },
  { label: '신시 (15:00~17:00)', el: 'geum' },
  { label: '유시 (17:00~19:00)', el: 'geum' },
  { label: '술시 (19:00~21:00)', el: 'to' },
  { label: '해시 (21:00~23:00)', el: 'su' },
]

// ── 사주팔자(연·월·일·시주) 계산 ─────────────────────────────

// 율리우스 적일수 (그레고리력) → 일주(일진) 산출용
function julianDay(y, m, d) {
  const a = Math.floor((14 - m) / 12)
  const yy = y + 4800 - a
  const mm = m + 12 * a - 3
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy
    + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045
}
// 검증: 1900-01-01 → 갑술, 2000-01-01 → 무오
export const dayStemIndex   = (y, m, d) => mod(julianDay(y, m, d) + 9, 10)
export const dayBranchIndex = (y, m, d) => mod(julianDay(y, m, d) + 1, 12)

// 월지: 1월=축, 2월=인 … 12월=자  (양력 근사)
const monthBranchIndex = (m) => mod(m, 12)
// 월간(오호둔): 연 천간으로 인월(寅月) 천간을 정하고 월 순서만큼 더함
const monthStemIndex = (yStem, m) => {
  const firstStem = mod(2 + (yStem % 5) * 2, 10) // 인월 천간
  const order = mod(m - 2, 12)                    // 인월(2월)=0
  return mod(firstStem + order, 10)
}
// 시간(오자둔): 일간으로 자시(子時) 천간을 정하고 시지만큼 더함
const hourStemIndex = (dStem, hBranch) => mod((dStem % 5) * 2 + hBranch, 10)

// 생년월일(+시간) → 오행별 점수. 본인을 뜻하는 일간(日干)에 가중치를 둠.
export function sajuScores(user) {
  const s = { mok: 0, hwa: 0, to: 0, geum: 0, su: 0 }
  const y = parseInt(user.year, 10)
  const m = parseInt(user.month, 10)
  const d = parseInt(user.day, 10)
  if (!y || !m || !d) return s
  const add = (el, w = 1) => { if (s[el] != null) s[el] += w }

  // 연주
  const ys = yearStemIndex(y)
  add(STEM_ELEMENT[ys]); add(BRANCH_ELEMENT[yearBranchIndex(y)])
  // 월주
  add(STEM_ELEMENT[monthStemIndex(ys, m)]); add(BRANCH_ELEMENT[monthBranchIndex(m)])
  // 일주 (일간 = 본인, 살짝 가중)
  const ds = dayStemIndex(y, m, d)
  add(STEM_ELEMENT[ds], 1.5); add(BRANCH_ELEMENT[dayBranchIndex(y, m, d)])
  // 시주 (선택)
  const hb = user.timeLabel ? TIME_SLOTS.findIndex(t => t.label === user.timeLabel) : -1
  if (hb >= 0) {
    add(STEM_ELEMENT[hourStemIndex(ds, hb)]); add(BRANCH_ELEMENT[hb])
  }
  return s
}

// 오행 점수 → 1·2·3위 (동점이면 목→화→토→금→수 순)
export function computeSajuResult(user) {
  const scores = sajuScores(user)
  const order = ['mok', 'hwa', 'to', 'geum', 'su']
  const sorted = order.slice().sort((a, b) => scores[b] - scores[a])
  return { first: sorted[0], second: sorted[1], third: sorted[2], scores }
}
