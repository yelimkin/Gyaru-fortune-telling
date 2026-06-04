import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FONT, BRAND } from '../constants/tokens'
import { TIME_SLOTS, computeSajuResult } from '../constants/saju'
import { store } from '../store'

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)
const DAYS   = Array.from({ length: 31 }, (_, i) => i + 1)

// 인트로 배경 미디어: mp4(영상) → gif → png → 그라데이션 순으로 자동 폴백
const HERO_VIDEO = 'intro-hero.mp4'
const HERO_IMGS  = ['intro-hero.gif', 'intro-hero.png']

const TOTAL = 5 // 이름 · 생년월일 · 태어난시간 · 성별 · 동의

const fieldSt = {
  width: '100%', padding: '15px 16px', fontSize: 16, fontFamily: FONT,
  border: '1.5px solid rgba(255,255,255,.18)', borderRadius: 12,
  background: 'rgba(0,0,0,.28)', color: '#fff', outline: 'none',
}
const selectSt = {
  ...fieldSt, paddingRight: 32,
  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\'%3E%3Cpath fill=\'%23ffffffcc\' d=\'M6 8 0 0h12z\'/%3E%3C/svg%3E")',
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center',
}
const labelSt = { display: 'block', fontSize: 12, color: 'rgba(255,255,255,.7)', marginBottom: 8, fontWeight: 600, fontFamily: FONT }

export default function IntroPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    name: '', year: '', month: '', day: '', timeEl: '', timeLabel: '', gender: '', agreed: false,
  })
  // 갸루 영상 배경: 'video' → 이미지(gif/png) → 'none'(그라데이션) 순으로 폴백
  const [heroKind, setHeroKind] = useState('video')
  const [imgIdx, setImgIdx] = useState(0)
  const showHero = heroKind !== 'none'
  const BASE = import.meta.env.BASE_URL

  const [step, setStep] = useState(0) // 0=랜딩, 1~5=입력 단계

  const yearNum = parseInt(user.year, 10)
  const yearOk = user.year.length === 4 && yearNum >= 1920 && yearNum <= 2026

  const canNext = {
    1: user.name.trim().length > 0,
    2: yearOk && user.month && user.day,
    3: true, // 태어난 시간은 선택
    4: user.gender !== '',
    5: user.agreed,
  }

  const goNext = () => setStep(s => Math.min(TOTAL, s + 1))
  const goBack = () => setStep(s => Math.max(0, s - 1))

  const finish = () => {
    store.setUser(user)
    store.setResult(computeSajuResult(user))
    navigate('/result')
  }

  const ctaBtn = (on) => ({
    width: '100%', marginTop: 28, padding: '16px', borderRadius: 14, border: 'none', fontFamily: FONT,
    fontSize: 16, fontWeight: 800,
    background: on ? `linear-gradient(135deg, ${BRAND.pinkDeep}, ${BRAND.pink})` : 'rgba(255,255,255,.12)',
    color: on ? '#fff' : 'rgba(255,255,255,.4)',
    boxShadow: on ? '0 8px 24px rgba(255,110,199,.4)' : 'none',
    cursor: on ? 'pointer' : 'not-allowed',
  })

  // ── 화면 전체 고정 갸루 영상 배경 (폼 뒤로 비침) ──────────────
  const videoBg = showHero ? (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden' }}>
      {heroKind === 'video' ? (
        <video autoPlay loop muted playsInline preload="auto"
          src={`${BASE}images/${HERO_VIDEO}`}
          onError={() => setHeroKind('img')}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 25%' }} />
      ) : (
        <img src={`${BASE}images/${HERO_IMGS[imgIdx]}`} alt=""
          onError={() => { if (imgIdx + 1 < HERO_IMGS.length) setImgIdx(imgIdx + 1); else setHeroKind('none') }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 25%' }} />
      )}
    </div>
  ) : (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0,
      background: 'radial-gradient(120% 80% at 80% 0%, rgba(255,110,199,.32), transparent 60%), radial-gradient(100% 70% at 0% 10%, rgba(192,132,252,.25), transparent 55%), #140A1E' }} />
  )

  // ── 히어로 텍스트 (영상 위 오버레이) ───────────────────────
  const heroText = (
    <div style={{ position: 'relative', padding: showHero ? '120px 22px 20px' : '56px 22px 20px',
      textShadow: showHero ? '0 2px 14px rgba(0,0,0,.7)' : 'none' }}>
      <div style={{ position: 'absolute', top: 18, right: 26, fontSize: 26 }} className="sparkle">✨</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 18 }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: BRAND.pink, display: 'inline-block' }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,.9)', letterSpacing: '.5px', fontFamily: FONT }}>갸루 사주관</span>
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: BRAND.pink, letterSpacing: '2px', fontFamily: FONT, marginBottom: 10 }}>
        오행으로 보는 갸루 캐릭터
      </div>
      <h1 style={{ fontSize: 30, fontWeight: 900, color: '#fff', lineHeight: 1.3, fontFamily: FONT }}>
        내 사주 속<br/>갸루는 누구일까?✨
      </h1>
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,.8)', lineHeight: 1.7, marginTop: 14, fontFamily: FONT }}>
        생년월일·태어난 시간으로 보는<br/>나의 오행(五行) 갸루 유형~ 결과는 바로 떠🔮
      </p>
    </div>
  )

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: BRAND.bg, fontFamily: FONT }}>
      {videoBg}

      {/* 콘텐츠 (영상 위, 투명 배경) */}
      <div className="fade-in" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* 맨 위: 뒤로가기 + 진행 표시 (입력 단계에서만) */}
        {step >= 1 ? (
          <div style={{ position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center', gap: 12,
            padding: '16px 22px 12px', textShadow: '0 1px 8px rgba(0,0,0,.6)' }}>
            <button onClick={goBack}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.7)', fontSize: 20, cursor: 'pointer', padding: '4px 6px 4px 0' }}>←</button>
            <div style={{ flex: 1, display: 'flex', gap: 6, alignItems: 'center' }}>
              {Array.from({ length: TOTAL }, (_, i) => (
                <div key={i} style={{ height: 5, borderRadius: 3, transition: 'all .3s',
                  background: i + 1 < step ? BRAND.pinkDeep : i + 1 === step ? BRAND.pink : 'rgba(255,255,255,.3)',
                  width: i + 1 === step ? 22 : 6 }} />
              ))}
            </div>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,.75)', fontWeight: 600 }}>{step} / {TOTAL}</span>
          </div>
        ) : (
          <div />
        )}

        {heroText}

        {/* 랜딩: 시작 버튼을 맨 아래로 (영상이 뒤로 비침) */}
        {step === 0 && (
          <>
            <div style={{ flex: 1 }} />
            <div style={{ padding: '20px 22px 40px' }}>
              <button onClick={goNext} style={{ ...ctaBtn(true), marginTop: 0 }}>내 갸루 사주 보러가기 🔮</button>
              <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,.45)', marginTop: 14, textShadow: '0 1px 8px rgba(0,0,0,.6)' }}>
                🔒 입력 정보는 결과 안내 목적으로만 사용돼요
              </p>
            </div>
          </>
        )}

        {/* 입력 폼 (투명 배경 — 영상이 뒤로 비침) */}
        {step >= 1 && (
          <div style={{ padding: '6px 22px 48px', maxWidth: 480, width: '100%', margin: '0 auto',
            textShadow: '0 1px 10px rgba(0,0,0,.65)' }}>
            <div key={step} className="fade-in">
              {/* Step 1: 이름 */}
              {step === 1 && (
                <>
                  <h2 style={{ fontSize: 23, fontWeight: 800, color: '#fff', lineHeight: 1.4, marginBottom: 8 }}>먼저, 이름이나<br/>닉네임을 알려줘~</h2>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,.65)', marginBottom: 28, lineHeight: 1.7 }}>결과에서 "○○님의 사주"로 불러줄게</p>
                  <label style={labelSt}>이름 (또는 닉네임)</label>
                  <input style={fieldSt} placeholder="예) 지민갸루" autoFocus value={user.name}
                    onChange={e => setUser({ ...user, name: e.target.value })}
                    onKeyDown={e => { if (e.key === 'Enter' && canNext[1]) goNext() }} />
                  <button style={ctaBtn(canNext[1])} disabled={!canNext[1]} onClick={() => canNext[1] && goNext()}>다음</button>
                </>
              )}

              {/* Step 2: 생년월일 */}
              {step === 2 && (
                <>
                  <h2 style={{ fontSize: 23, fontWeight: 800, color: '#fff', lineHeight: 1.4, marginBottom: 8 }}>생년월일이<br/>언제야?</h2>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,.65)', marginBottom: 28, lineHeight: 1.7 }}>사주 계산에 쓰여~ (양력으로 입력해줘)</p>
                  <label style={labelSt}>생년월일</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input style={{ ...fieldSt, flex: 1.3 }} type="tel" inputMode="numeric" maxLength={4} placeholder="연도 (예: 2000)" autoFocus
                      value={user.year} onChange={e => setUser({ ...user, year: e.target.value.replace(/[^0-9]/g, '') })} />
                    <select style={{ ...selectSt, flex: 1 }} value={user.month} onChange={e => setUser({ ...user, month: e.target.value })}>
                      <option value="">월</option>
                      {MONTHS.map(m => <option key={m} value={m}>{m}월</option>)}
                    </select>
                    <select style={{ ...selectSt, flex: 1 }} value={user.day} onChange={e => setUser({ ...user, day: e.target.value })}>
                      <option value="">일</option>
                      {DAYS.map(d => <option key={d} value={d}>{d}일</option>)}
                    </select>
                  </div>
                  {user.year && !yearOk && (
                    <p style={{ fontSize: 12, color: '#FF8FA0', marginTop: 7 }}>연도를 4자리로 정확히 입력해줘 (1920~2026)</p>
                  )}
                  <button style={ctaBtn(canNext[2])} disabled={!canNext[2]} onClick={() => canNext[2] && goNext()}>다음</button>
                </>
              )}

              {/* Step 3: 태어난 시간 */}
              {step === 3 && (
                <>
                  <h2 style={{ fontSize: 23, fontWeight: 800, color: '#fff', lineHeight: 1.4, marginBottom: 8 }}>태어난 시간도<br/>알고 있어?</h2>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,.65)', marginBottom: 28, lineHeight: 1.7 }}>모르면 건너뛰어도 돼~ 알면 사주가 더 정확해져</p>
                  <label style={labelSt}>태어난 시간</label>
                  <select style={selectSt} value={user.timeLabel}
                    onChange={e => {
                      const slot = TIME_SLOTS.find(s => s.label === e.target.value)
                      setUser({ ...user, timeLabel: e.target.value, timeEl: slot ? slot.el : '' })
                    }}>
                    <option value="">모름 / 선택 안 함</option>
                    {TIME_SLOTS.map(s => <option key={s.label} value={s.label}>{s.label}</option>)}
                  </select>
                  <button style={ctaBtn(true)} onClick={goNext}>{user.timeLabel ? '다음' : '잘 몰라요, 건너뛸래'}</button>
                </>
              )}

              {/* Step 4: 성별 (선택 시 자동으로 다음) */}
              {step === 4 && (
                <>
                  <h2 style={{ fontSize: 23, fontWeight: 800, color: '#fff', lineHeight: 1.4, marginBottom: 8 }}>성별을<br/>골라줘</h2>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,.65)', marginBottom: 28, lineHeight: 1.7 }}>결과 캐릭터에 반영돼~</p>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {[{ val: '여자', emoji: '👩' }, { val: '남자', emoji: '👨' }].map(({ val, emoji }) => {
                      const on = user.gender === val
                      return (
                        <button key={val} onClick={() => { setUser({ ...user, gender: val }); setStep(5) }}
                          style={{ flex: 1, padding: '28px 0', borderRadius: 16, border: '1.5px solid',
                            borderColor: on ? BRAND.pink : 'rgba(255,255,255,.2)',
                            background: on ? 'rgba(255,110,199,.25)' : 'rgba(0,0,0,.28)',
                            color: on ? '#fff' : 'rgba(255,255,255,.85)',
                            fontFamily: FONT, fontSize: 17, fontWeight: 700, cursor: 'pointer' }}>
                          <div style={{ fontSize: 34, marginBottom: 8 }}>{emoji}</div>
                          {val}
                        </button>
                      )
                    })}
                  </div>
                </>
              )}

              {/* Step 5: 개인정보 동의 */}
              {step === 5 && (
                <>
                  <h2 style={{ fontSize: 23, fontWeight: 800, color: '#fff', lineHeight: 1.4, marginBottom: 8 }}>마지막!<br/>개인정보 동의만 해줘</h2>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,.65)', marginBottom: 24, lineHeight: 1.7 }}>동의하면 바로 사주 결과가 떠🔮</p>
                  <div onClick={() => setUser({ ...user, agreed: !user.agreed })}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer',
                      padding: '16px 18px', borderRadius: 14,
                      background: user.agreed ? 'rgba(255,110,199,.2)' : 'rgba(0,0,0,.28)',
                      border: `1.5px solid ${user.agreed ? 'rgba(255,110,199,.6)' : 'rgba(255,255,255,.18)'}`, transition: 'all .2s' }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${user.agreed ? BRAND.pink : 'rgba(255,255,255,.4)'}`,
                      background: user.agreed ? BRAND.pink : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      {user.agreed && <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>✓</span>}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, color: '#fff', fontWeight: 600, lineHeight: 1.5 }}>
                        개인정보 수집 및 이용에 동의해요 <span style={{ color: BRAND.pink }}>(필수)</span>
                      </div>
                      <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,.6)', marginTop: 4, lineHeight: 1.55 }}>
                        생년월일·이름은 사주 결과 안내 목적으로만 쓰이고, 제3자에게 제공 안 해요
                      </div>
                    </div>
                  </div>
                  <button style={ctaBtn(canNext[5])} disabled={!canNext[5]} onClick={() => canNext[5] && finish()}>
                    내 갸루 사주 보기 🔮
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
