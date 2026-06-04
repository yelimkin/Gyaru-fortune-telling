# 이미지 넣는 곳

여기에 아래 이름으로 PNG를 넣으면 화면에 자동으로 표시돼요.
파일이 없으면 자동 폴백(그라데이션/이모지)되니, 일부만 넣어도 OK.

## 처음(인트로) 화면 미디어 (영상/GIF/이미지)

이름·생년월일 입력 화면 상단 배너에 깔려요. 아래 우선순위로 **있는 것 하나만 자동으로** 표시돼요:

1. `intro-hero.mp4` — 영상 (자동재생·무한반복·무음). 가장 추천 ✅
2. `intro-hero.gif` — 움짤
3. `intro-hero.png` — 정지 이미지
4. 셋 다 없으면 → 핑크 그라데이션으로 자동 폴백

- 권장: 가로로 넓거나 정사각형(예: 1080×1080, 1200×800), 위쪽 25% 지점이 보이게 잘려요.
- 글자가 하단에 겹쳐지므로 아래쪽은 어두운 톤이면 가독성이 좋아요.
- ⚠️ MP4는 자동재생을 위해 **무음(audio 없음/무시)** 으로 재생돼요. 모바일 자동재생 위해 `muted`·`playsInline` 적용됨.
- 💡 용량은 MP4가 GIF보다 훨씬 작아요. 같은 영상이면 MP4를 추천해요.

---

## 결과 화면 이미지

## 파일 이름 규칙

`result-{오행키}-{성별}.png`

- 오행키: `mok`(목/🌱 새싹) · `hwa`(화/🔥 불꽃) · `to`(토/🧱 흙댕댕) · `geum`(금/🧊 철벽) · `su`(수/💧 물흐름)
- 성별: `male` · `female`

### 전체 목록 (총 10장)

```
result-mok-female.png    result-mok-male.png
result-hwa-female.png    result-hwa-male.png
result-to-female.png     result-to-male.png
result-geum-female.png   result-geum-male.png
result-su-female.png     result-su-male.png
```

## 권장 사양

- 정사각형(예: 600×600), 카드에 `object-fit: cover`로 채워져요.
- 결과 순위 카드(작게)와 상세 슬라이드(크게) 모두 같은 이미지를 사용해요.
