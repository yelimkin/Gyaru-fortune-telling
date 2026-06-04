import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TYPES } from '../constants/types'
import { FONT } from '../constants/tokens'
import { zodiacOf, yearStem } from '../constants/saju'
import { store } from '../store'

const TOTAL = 5

export default function ResultPage() {
  const navigate = useNavigate()
  const [slide, setSlide] = useState(0)
  const [copied, setCopied] = useState(false)

  const resultKeys = store.getResult()
  const user = store.getUser()

  useEffect(() => { if (!resultKeys || !user) navigate('/') }, [])
  if (!resultKeys || !user) return null

  const first  = TYPES[resultKeys.first]
  const second = TYPES[resultKeys.second]
  const third  = TYPES[resultKeys.third]
  const c = first.color
  const next = () => setSlide(s => s + 1)

  const y = parseInt(user.year, 10)
  const zodiac = y ? zodiacOf(y) : ''
  const stem = y ? yearStem(y) : ''

  const splitDesc = (desc) => desc.split(/(?<=[.~?!])\s+/).filter(s => s.trim().length > 3)

  const handleShare = async () => {
    const url = window.location.origin + window.location.pathname
    const text = `내 사주 속 갸루는 '${first.name}'(${first.el})! 너도 해봐~ 🔮✨`
    if (navigator.share) {
      try { await navigator.share({ title: '갸루 사주 테스트', text, url }) } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(`${text}\n${url}`)
        setCopied(true); setTimeout(() => setCopied(false), 2500)
      } catch {}
    }
  }

  const onApply = () => {
    navigate(`/apply?type=${encodeURIComponent(first.name)}&name=${encodeURIComponent(user.name)}&gender=${encodeURIComponent(user.gender)}`)
  }

  // 결과 이미지 자리: public/images/result-{key}-{male|female}.png 를 넣으면 자동 표시,
  // 없으면 오행 그라데이션 + 이모지로 폴백.
  const imgSrc = (key) => `${import.meta.env.BASE_URL}images/result-${key}-${user.gender === '남자' ? 'male' : 'female'}.png`

  const EmojiCard = ({ type, size = 96 }) => (
    <div style={{ position: 'relative', width: size, height: size, borderRadius: 22, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.5, overflow: 'hidden',
      background: `linear-gradient(135deg, ${type.color.chip}, ${type.color.bg})`,
      border: `1px solid ${type.color.accent}44`, boxShadow: '0 8px 22px rgba(0,0,0,.3)' }}>
      {type.emoji}
      <img src={imgSrc(type.key)} alt={type.name}
        onError={e => { e.target.style.display = 'none' }}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  )

  const NavBtn = ({ label }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 8 }}>
      <button onClick={(e) => { e.stopPropagation(); next() }}
        style={{ width: 56, height: 56, borderRadius: '50%', background: c.chip, border: 'none',
          color: '#fff', fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', boxShadow: '0 8px 20px rgba(0,0,0,.35)', fontFamily: FONT }}>→</button>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', marginTop: 8 }}>{label || '다음'}</div>
    </div>
  )

  const TapHint = () => (
    <div style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,.18)', marginTop: 16, letterSpacing: '1px', pointerEvents: 'none' }}>화면을 톡 누르면 넘어가~</div>
  )

  const LockBadge = ({ text }) => (
    <span style={{ fontSize: 13, fontWeight: 600, color: c.accent, background: 'rgba(0,0,0,.7)', padding: '10px 20px', borderRadius: 22, border: `1px solid ${c.accent}55` }}>{text}</span>
  )

  return (
    <div style={{ background: c.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px 0' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', letterSpacing: '1.5px', fontWeight: 600 }}>갸루 사주 결과 ✨</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: c.accent }}>{slide + 1} / {TOTAL}</div>
      </div>

      {/* 점 인디케이터 */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', padding: '12px 0 0' }}>
        {Array.from({ length: TOTAL }).map((_, i) => (
          <div key={i} style={{ height: 5, borderRadius: 3,
            background: i <= slide ? c.accent : 'rgba(255,255,255,.18)',
            width: i === slide ? 22 : 6, transition: 'all .3s ease' }} />
        ))}
      </div>

      <div key={slide} className="fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* ── 슬라이드 0: 순위 + 사주 요약 ── */}
        {slide === 0 && (
          <div onClick={next} style={{ flex: 1, padding: '24px 24px 40px', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{user.name}님의 갸루 오행 순위</div>
            {zodiac && (
              <div style={{ fontSize: 12.5, color: c.accent, marginBottom: 18, fontWeight: 600 }}>
                {y}년생 · {zodiac}띠 · 연주 천간 「{stem}」 기운 ✨
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
              {/* 1위 잠김 */}
              <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px',
                  background: `linear-gradient(135deg, ${c.chip}44, ${c.chip}22)`, filter: 'blur(4px)', userSelect: 'none' }}>
                  <span style={{ fontSize: 30 }}>🥇</span>
                  <div>
                    <div style={{ fontSize: 11, color: c.accent, fontWeight: 700, letterSpacing: '1.5px' }}>1위 · {first.el}</div>
                    <div style={{ fontSize: 19, fontWeight: 800, color: '#fff' }}>{first.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', marginTop: 2 }}>{first.tagline}</div>
                  </div>
                </div>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LockBadge text="🔒 넘기면서 공개돼~" />
                </div>
              </div>
              {/* 2위 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 16 }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>🥈</span>
                <EmojiCard type={second} size={52} />
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', fontWeight: 600, letterSpacing: '1.5px', marginBottom: 2 }}>2위 · {second.el}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{second.name}</div>
                  <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,.4)', marginTop: 2 }}>{second.tagline}</div>
                </div>
              </div>
              {/* 3위 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 16 }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>🥉</span>
                <EmojiCard type={third} size={48} />
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', fontWeight: 600, letterSpacing: '1.5px', marginBottom: 2 }}>3위 · {third.el}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,.8)' }}>{third.name}</div>
                  <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,.35)', marginTop: 2 }}>{third.tagline}</div>
                </div>
              </div>
            </div>
            <div style={{ flex: 1 }} />
            <NavBtn label="3위부터 보기" />
            <TapHint />
          </div>
        )}

        {/* ── 슬라이드 1~2: 3위 / 2위 ── */}
        {(slide === 1 || slide === 2) && (() => {
          const t = slide === 1 ? third : second
          const medal = slide === 1 ? '🥉' : '🥈'
          const nextLabel = slide === 1 ? '2위 보기' : '1위 확인하기'
          const ss = splitDesc(t.desc); const h = Math.ceil(ss.length / 2)
          return (
            <div onClick={next} style={{ flex: 1, padding: '24px 24px 40px', display: 'flex', flexDirection: 'column', overflowY: 'auto', WebkitOverflowScrolling: 'touch', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 22 }}>{medal}</span>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>{t.name} <span style={{ fontSize: 13, color: c.accent, fontWeight: 600 }}>{t.el}</span></div>
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.35)', marginBottom: 20 }}>"{t.tagline}"</div>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 22 }}><EmojiCard type={t} size={110} /></div>
              {ss.slice(0, h).map((s, i) => <p key={i} style={{ fontSize: 15.5, color: 'rgba(255,255,255,.88)', lineHeight: 1.95, marginBottom: 14 }}>{s}</p>)}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.08)' }} />
                <span style={{ fontSize: 11, color: c.accent, fontWeight: 700, letterSpacing: '2px' }}>근데 말야</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.08)' }} />
              </div>
              {ss.slice(h).map((s, i) => <p key={i} style={{ fontSize: 15.5, color: 'rgba(255,255,255,.88)', lineHeight: 1.95, marginBottom: 14 }}>{s}</p>)}
              <NavBtn label={nextLabel} /><TapHint />
            </div>
          )
        })()}

        {/* ── 슬라이드 3: 1위 공개 ── */}
        {slide === 3 && (() => {
          const ss = splitDesc(first.desc)
          return (
            <div onClick={next} style={{ flex: 1, padding: '24px 24px 40px', display: 'flex', flexDirection: 'column', overflowY: 'auto', WebkitOverflowScrolling: 'touch', cursor: 'pointer' }}>
              <div style={{ fontSize: 13, color: c.accent, fontWeight: 700, letterSpacing: '1.5px', marginBottom: 10 }}>🥇 {user.name}님의 1위 갸루 · {first.el}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', lineHeight: 1.25, marginBottom: 4 }}>{first.name}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', fontStyle: 'italic', marginBottom: 20 }}>"{first.tagline}"</div>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 22 }}><EmojiCard type={first} size={130} /></div>
              {ss.slice(0, 3).map((s, i) => <p key={i} style={{ fontSize: 15.5, color: 'rgba(255,255,255,.88)', lineHeight: 1.95, marginBottom: 12 }}>{s}</p>)}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.08)' }} />
                <span style={{ fontSize: 11, color: c.accent, fontWeight: 700, letterSpacing: '2px' }}>갸루 사주 팩트</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.08)' }} />
              </div>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#fff', lineHeight: 1.7, marginBottom: 16 }}>이 유형, 그냥 알고 끝내기엔 좀 아깝잖아~</p>
              <p style={{ fontSize: 14.5, color: 'rgba(255,255,255,.6)', lineHeight: 1.8, marginBottom: 20 }}>
                {first.name}이 올해 진짜 조심해야 할 게 뭔지, 사주로 콕 집어서 알려줄게.
              </p>
              <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', marginBottom: 28 }}>
                <div style={{ padding: '18px 20px', background: 'rgba(255,255,255,.07)', filter: 'blur(5px)', userSelect: 'none' }}>
                  <div style={{ fontSize: 13, color: c.accent, fontWeight: 700, marginBottom: 10 }}>이 갸루가 올해 반복하는 핵심 패턴</div>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,.8)', lineHeight: 1.75, marginBottom: 8 }}>{first.trap}</p>
                </div>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LockBadge text="🔒 더알아보기 후 공개" />
                </div>
              </div>
              <NavBtn label="내 사주 더 보기" /><TapHint />
            </div>
          )
        })()}

        {/* ── 슬라이드 4: CTA ── */}
        {slide === 4 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -10, bottom: 20, fontSize: 180, opacity: 0.08, pointerEvents: 'none', zIndex: 0 }}>{first.emoji}</div>
            <div style={{ flex: 1, padding: '24px 24px 40px', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
              <div style={{ marginBottom: 26 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', lineHeight: 1.45, marginBottom: 12 }}>내 사주, 제대로<br/>풀어볼 시간이야✨</div>
                <div style={{ fontSize: 14.5, color: 'rgba(255,255,255,.5)', lineHeight: 1.8 }}>
                  오행 유형만 아는 거랑,<br/><span style={{ color: c.accent, fontWeight: 600 }}>올해 운을 어떻게 쓰는지</span> 아는 건 다르거든
                </div>
              </div>

              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 11, color: c.accent, fontWeight: 700, letterSpacing: '2px', marginBottom: 14 }}>사주 풀이로 알게 되는 것들</div>
                <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden' }}>
                  <div style={{ padding: '18px 20px', background: 'rgba(255,255,255,.07)', filter: 'blur(4px)', userSelect: 'none' }}>
                    {[['🔮', `${first.name}의 2026년 재물·애정운 흐름`], ['⚡', '지금 당장 바꾸면 좋은 행동 딱 1가지'], ['💞', '나랑 진짜 잘 맞는 오행 궁합'], ['🗝️', '내 약한 기운 채우는 나만의 방법']].map(([icon, text], i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,.07)' : 'none' }}>
                        <span style={{ fontSize: 16 }}>{icon}</span>
                        <span style={{ fontSize: 14, color: 'rgba(255,255,255,.85)' }}>{text}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LockBadge text="🔒 더알아보기 후 공개돼~" />
                  </div>
                </div>
              </div>

              <div style={{ padding: '18px 20px', background: `linear-gradient(135deg, ${c.chip}55, ${c.chip}22)`,
                border: `1px solid ${c.accent}33`, borderRadius: 14, marginBottom: 22 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: c.accent, letterSpacing: '1.5px', marginBottom: 6 }}>갸루 사주관 · 오행 밸런스</div>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: '#fff', lineHeight: 1.5, marginBottom: 6 }}>나를 알면, 올 한 해가 달라져~</div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', lineHeight: 1.8, margin: 0 }}>
                  내 사주에 넘치는 기운과 부족한 기운, <span style={{ color: c.accent, fontWeight: 600 }}>오행 밸런스</span>를 알면 — 왜 이 패턴이 반복됐는지, 어떻게 바꿀 수 있는지가 딱 보여.
                </p>
              </div>

              <button onClick={onApply}
                style={{ width: '100%', background: c.chip, color: '#fff', border: 'none', borderRadius: 14, padding: '15px', fontSize: 17, fontWeight: 700, cursor: 'pointer', fontFamily: FONT, marginBottom: 12 }}>
                내 사주 자세히 풀어보기 🔮
              </button>
              <button onClick={handleShare}
                style={{ width: '100%', padding: '14px', borderRadius: 14, border: `1.5px solid ${c.accent}55`, background: 'transparent', color: 'rgba(255,255,255,.7)', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>
                {copied ? '링크 복사됐어 ✓' : '친구한테 공유하기 🔗'}
              </button>
              <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,.3)', marginTop: 10, fontFamily: FONT }}>
                친구는 어떤 갸루 나오는지 궁금하잖아~
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
