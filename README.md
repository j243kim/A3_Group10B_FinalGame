# Fragmented – A TBI Awareness Game

## Group Number

Group 10B — GBDA 302: Global Digital Project 2 (Winter 2026)

## Group Members

| Name                | WatID         | Student Number |
| ------------------- | ------------- | -------------- |
| Jimin Kim           | j243kim       | 21062367       |
| Catarina Jin        | c59jin        | 21077832       |
| Kaiyang Sun (Kevin) | ky3sun        | 2102654        |
| Annora Jo           | a3jo          | 21065832       |

## Description

Fragmented is a p5.js game that fosters empathy and understanding around Traumatic Brain Injury (TBI). Players progress through three stages representing a typical day — morning routine at home, running errands outside, and getting through work — while managing cognitive and sensory challenges that mirror the lived experience of TBI.

The game includes the following core mechanics:

1. **Memory Fade** – The on-screen objective text gradually fades over time, requiring players to press M to briefly recall it. This represents the short-term memory difficulties commonly experienced after TBI [1][2].
2. **Sensory Overload** – An overload meter rises continuously, accelerating when the player is near stimulus zones (TV, phone, car, screen glare, printer). Calm zones reduce overload on contact. The mechanic reflects sensory processing difficulties documented in TBI research [3].
3. **Cognitive Fatigue** – Player movement speed decreases as overload increases, simulating the physical and mental fatigue associated with sustained cognitive effort after TBI [2].
4. **Intrusive Distractions** – Semi-random visual noise elements appear on screen as overload grows, representing impaired stimulus filtering [3].
5. **Attention Drift** – At high overload, slight random offsets are added to player movement input, representing reduced motor and cognitive control [2].
6. **Emotional Frustration** – On-screen thought messages appear during gameplay, voicing the inner emotional struggle of performing simple tasks under strain [3].
7. **Fading Awareness** – Distant collectible stars become harder to see at high overload, representing fading spatial and task memory [2].

The game uses procedurally generated audio through the Web Audio API — layered ambient soundscapes, proximity-based obstacle sounds, and bandpass-filtered white noise — to create an evolving sense of sensory pressure without relying on pre-recorded audio files. A Low Sensory Mode (press L) is available for accessibility [4].

The design philosophy follows Bogost's concept of procedural rhetoric [5]: the game communicates the TBI experience through its interactive systems rather than through narrative exposition alone.

---

## Setup and Interaction Instructions

1. Open the game via the GitHub Pages link, or open `index.html` in Google Chrome.
2. Press **ENTER** to start the game.
3. Use **WASD or arrow keys** to move the player.
4. Press **M** to briefly recall the objective when it fades.
5. Press **J** to activate the Calm Ability (if charges are available).
6. Press **L** to toggle Low Sensory Mode.
7. Press **R** to return to the title screen.
8. Press **N** to toggle the map.

---

## Iteration Notes

### Post-Playtest

During the in-class playtesting session (Week 11), peers played the near-final prototype and provided informal feedback. Key observations included: the high-pitched background tones were too harsh and distracting, the visual effects could be mistaken for a low-vision simulation rather than a TBI experience, and Stage 3 felt repetitive because it reused the same mechanics as Stage 2. The following three concrete changes were identified and made before the final submission:

1. **Audio redesign — rebalanced background sound and replaced high-pitch tones with white noise**
   - Removed the on-screen instruction "L = Low Sensory Mode."
   - Rebalanced the background audio so it is less distracting.
   - Removed the current high-pitched sound.
   - Replaced it with a softer white noise / ambient sound, and adjusted the frequency so it feels less harsh.

2. **Visual and camera improvements — revised presentation so the game is not mistaken for a low-vision simulation**
   - Revised the visual presentation so it is less likely to be mistaken for a low-vision game.
   - Instead of relying on that effect, made the camera track and zoom in on the character.

3. **Stage 3 mechanic and controls — added a new Level 3 mechanic and developer navigation keys**
   - Added a new mechanic for Level 3 instead of reusing the moving obstacle and overload timer from Level 2.
   - If a new Level 3 mechanic is added, removed the K key function.
   - Added default level navigation buttons for easier testing:
     - L = return to the previous level
     - P = skip to the next level

---

## Assets

All image assets listed below are sourced from third-party platforms under their respective free-use licenses. No audio files are used; all audio is procedurally generated via the Web Audio API.

1. Car image — "Red Car Top Down" [6]. Used as the Stage 2 car obstacle.
2. House/environment tileset — "A House" [7]. Used for Stage 1 home environment elements.
3. Sky background — "Sky" [8]. Used as the outdoor background in Stage 2.

All other image assets (furniture, office items, NPC, collectibles, UI elements) were sourced from free asset packs on [itch.io](https://itch.io) and [OpenGameArt](https://opengameart.org).

---

## References

### In-Code Citations (TBI Research)

[1] CDC. 2024. *Get the Facts About TBI.* Centers for Disease Control and Prevention. Retrieved from https://www.cdc.gov/traumatic-brain-injury/data-research/facts-stats/

[2] Johansson, B., Berglund, P., and Ronnback, L. 2009. Mental fatigue and impaired information processing after mild and moderate traumatic brain injury. *Brain Injury* 23, 13-14, 1027–1040.

[3] Lew, H. L., Poole, J. H., Guillory, S. B., Salerno, R. M., Leskin, G., and Sigford, B. 2006. Persistent problems after traumatic brain injury: The need for long-term follow-up and coordinated care. *Journal of Rehabilitation Research and Development* 43, 2, vii–x.

[4] Game Accessibility Guidelines. 2012. *A reference for inclusive game design.* Retrieved from http://gameaccessibilityguidelines.com

[5] Bogost, I. 2007. *Persuasive Games: The Expressive Power of Videogames.* MIT Press, Cambridge, MA.

### Asset Sources

[6] OpenGameArt. n.d. *Red Car Top Down.* Retrieved from https://opengameart.org/content/red-car-top-down

[7] Azez2. n.d. *A House.* itch.io. Retrieved from https://azez2.itch.io/a-house

[8] Gamer247. n.d. *Sky.* itch.io. Retrieved from https://gamer247.itch.io/sky

[9] Yahoo Images. n.d. “pixel bed top down.” Retrieved April 11, 2026 from https://ca.images.search.yahoo.com/search/images;_ylt=AwrE_AZ39MlpLgIAL07rFAx.;_ylu=Y29sbwNiZjEEcG9zAzEEdnRpZAMEc2VjA3BpdnM-?p=pixel+bed+top+down&fr2=piv-web&type=E210CA885G0&fr=mcafee#id=0&iurl=https%3A%2F%2Fcdnb.artstation.com%2Fp%2Fassets%2Fimages%2Fimages%2F035%2F882%2F977%2Flarge%2Fgregory-ligman-bed-00.jpg%3F1616150094&action=click

[10] Yahoo Images. n.d. “pixel tv top down.” Retrieved April 11, 2026 from https://ca.images.search.yahoo.com/search/images;_ylt=AwrEpEbN9clpPQIA1jLrFAx.;_ylu=Y29sbwNiZjEEcG9zAzEEdnRpZAMEc2VjA3BpdnM-?p=pixel+tv+top+down&fr2=piv-web&type=E210CA885G0&fr=mcafee#id=1&iurl=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F029%2F777%2F021%2Flarge_2x%2Fpixel-art-illustration-television-pixelated-tv-classic-tv-electronics-icon-pixelated-for-the-pixel-art-game-and-icon-for-website-and-video-game-old-school-retro-vector.jpg&action=click

[11] Yahoo Images. n.d. “pixel medicine bottle top down.” Retrieved April 11, 2026 from https://ca.images.search.yahoo.com/search/images;_ylt=AwrFFRGd9slpCQIAztrrFAx.;_ylu=Y29sbwNiZjEEcG9zAzEEdnRpZAMEc2VjA3BpdnM-?p=pixel+medicine+bottle+top+down&fr2=piv-web&type=E210CA885G0&fr=mcafee#id=2&iurl=https%3A%2F%2Fimg.freepik.com%2Fpremium-vector%2Fpixel-art-illustration-medicine-bottle-pixelated-bottle-medicine-bottle-pills-pixelated-game_1038602-1123.jpg%3Fw%3D360&action=click

[12] Google Images. n.d. “key pixel art.” Retrieved April 11, 2026 from https://www.google.com/search?sca_esv=e7687de8d1b3fbf8&rlz=1C1ONGR_enCA1073CA1073&sxsrf=ANbL-n5Eq0wgEfI8jGS7Mq0KfjFk5YfTIA:1774931126923&udm=2&fbs=ADc_l-aN0CWEZBOHjofHoaMMDiKpaEWjvZ2Py1XXV8d8KvlI3o6iwGk6Iv1tRbZIBNIVs-5-bUj3iBl-UxHsANYwOkWWQqZAJJdwuRaSoLHfELMHAQFneUwKM50jpvR3lgPoPKPocSAVLVIC1tmtj18NQh34sJoMKkeMLmVT0BQXR6brJvbElwncIYMxPc2e7aIP7xyAYnsJEw_6y0zcNxiTmikcViftsA&q=key+pixel+art&sa=X&sqi=2&ved=2ahUKEwiXs8japcmTAxXqFVkFHXQ5KlcQtKgLegQIDBAB&biw=2560&bih=1305&dpr=1#sv=CAMSVhoyKhBlLUJCQ056OVN0b1dUOUZNMg5CQkNOejlTdG9XVDlGTToORmQ4UWg4VENRQWVBbk0gBCocCgZtb3NhaWMSEGUtQkJDTno5U3RvV1Q5Rk0YADABGAcgl_ncqgdKCBABGAEgASgB

[13] Yahoo Images. n.d. “pixel wood floor.” Retrieved April 11, 2026 from https://ca.images.search.yahoo.com/search/images;_ylt=AwrNah7r.MlpSRQUjMrtFAx.;_ylu=c2VjA3NlYXJjaARzbGsDYnV0dG9u;_ylc=X1MDMjExNDcyMTAwNQRfcgMyBGZyA21jYWZlZQRmcjIDcDpzLHY6aSxtOnNiLXRvcARncHJpZAN6QXVwdFdXd1JkS3U0UU1ubThKd1BBBG5fcnNsdAMwBG5fc3VnZwMzBG9yaWdpbgNjYS5pbWFnZXMuc2VhcmNoLnlhaG9vLmNvbQRwb3MDMARwcXN0cgMEcHFzdHJsAzAEcXN0cmwDMTcEcXVlcnkDcGl4ZWwlMjB3b29kJTIwZmxvb3IlMjAEdF9zdG1wAzE3NzQ4NDQzODM-?p=pixel+wood+floor+&fr=mcafee&fr2=p%3As%2Cv%3Ai%2Cm%3Asb-top&ei=UTF-8&x=wrt&type=E210CA885G0#id=95&iurl=https%3A%2F%2Fi.pinimg.com%2F736x%2Fa6%2Fcc%2F7e%2Fa6cc7e2259ebc3c78c5f7d314813a463.jpg&action=click

[14] Yahoo Images. n.d. “pixel bag.” Retrieved April 11, 2026 from https://ca.images.search.yahoo.com/search/images;_ylt=AwrFBFSQ.slpgbMUfJftFAx.?p=pixel+bag&ei=UTF-8&type=E210CA885G0&fr=mcafee&fr2=p%3As%2Cv%3Ai#id=12&iurl=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F023%2F867%2F086%2Flarge_2x%2Fbackpack-bag-camp-game-pixel-art-illustration-vector.jpg&action=click

[15] Yahoo Images. n.d. “pixel card jpg.” Retrieved April 11, 2026 from https://ca.images.search.yahoo.com/search/images;_ylt=AwrFBFSsGcppASsXE5TtFAx.;_ylu=c2VjA3NlYXJjaARzbGsDYnV0dG9u;_ylc=X1MDMjExNDcyMTAwNQRfcgMyBGZyA21jYWZlZQRmcjIDcDpzLHY6aSxtOnNiLXRvcARncHJpZANfRFlSWC5SWlFKeTRKLk5MaDlUMm9BBG5fcnNsdAMwBG5fc3VnZwMxMARvcmlnaW4DY2EuaW1hZ2VzLnNlYXJjaC55YWhvby5jb20EcG9zAzAEcHFzdHIDBHBxc3RybAMwBHFzdHJsAzE0BHF1ZXJ5A3BpeGVsJTIwY2FyZCUyMGpwZwR0X3N0bXADMTc3NDg1MjUyNg--?p=pixel+card+jpg&fr=mcafee&fr2=p%3As%2Cv%3Ai%2Cm%3Asb-top&ei=UTF-8&x=wrt&type=E210CA885G0#id=33&iurl=https%3A%2F%2Fv.hdfcbank.com%2Fcontent%2Fdam%2Fhdfc-aem-microsites%2Fhtdocs%2Fcommon%2Fpixel-microsite%2Fimages%2Fcustomise_card_pink_1.png&action=click

[16] Yahoo Images. n.d. “pixel grass game.” Retrieved April 11, 2026 from https://ca.images.search.yahoo.com/search/images;_ylt=AwrFBFTNGspp1O0VqOPtFAx.;_ylu=c2VjA3NlYXJjaARzbGsDYnV0dG9u;_ylc=X1MDMjExNDcyMTAwNQRfcgMyBGZyA21jYWZlZQRmcjIDcDpzLHY6aSxtOnNiLXRvcARncHJpZAMxTm5iNXEzWlRqNktWbVR4YmdUOXNBBG5fcnNsdAMwBG5fc3VnZwMwBG9yaWdpbgNjYS5pbWFnZXMuc2VhcmNoLnlhaG9vLmNvbQRwb3MDMARwcXN0cgMEcHFzdHJsAzAEcXN0cmwDMTYEcXVlcnkDcGl4ZWwlMjBncmFzcyUyMGdhbWUEdF9zdG1wAzE3NzQ4NTI4Mzk-?p=pixel+grass+game&fr=mcafee&fr2=p%3As%2Cv%3Ai%2Cm%3Asb-top&ei=UTF-8&x=wrt&type=E210CA885G0#id=19&iurl=https%3A%2F%2Fopengameart.org%2Fsites%2Fdefault%2Ffiles%2Fgrass_tileset_16x16_preview_0.png&action=click

[17] Yahoo Images. n.d. “pixel park bench.” Retrieved April 11, 2026 from https://ca.images.search.yahoo.com/search/images;_ylt=AwrNaqPcG8ppIQIAzl3rFAx.;_ylu=Y29sbwNiZjEEcG9zAzEEdnRpZAMEc2VjA3BpdnM-?p=pixel+park+bench&fr2=piv-web&type=E210CA885G0&fr=mcafee#id=1&iurl=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F038%2F465%2F690%2Foriginal%2Fpixel-art-illustration-bench-park-pixelated-bench-park-bench-park-pixelated-for-the-pixel-art-game-and-icon-for-website-and-video-game-old-school-retro-free-vector.jpg&action=click

[18] Yahoo Images. n.d. “pixel grocery.” Retrieved April 11, 2026 from https://ca.images.search.yahoo.com/search/images;_ylt=AwrihGRCHMppZgMA7qvrFAx.;_ylu=Y29sbwNiZjEEcG9zAzEEdnRpZAMEc2VjA3BpdnM-?p=pixel+grocery&fr2=piv-web&type=E210CA885G0&fr=mcafee#id=3&iurl=https%3A%2F%2Fimg.freepik.com%2Fpremium-vector%2Fpixel-art-grocery-storefront-with-fresh-produce-retro-design_1292377-23735.jpg%3Fw%3D2000&action=click

[19] Yahoo Images. n.d. “prescription pixel png.” Retrieved April 11, 2026 from https://ca.images.search.yahoo.com/search/images;_ylt=Awril7VaAcxpKgIAzl3rFAx.;_ylu=Y29sbwNiZjEEcG9zAzEEdnRpZAMEc2VjA3BpdnM-?p=prescription+pixel+png&fr2=piv-web&type=E210CA885G0&fr=mcafee#id=4&iurl=https%3A%2F%2Fmedia.istockphoto.com%2Fid%2F1569402756%2Ffr%2Fvectoriel%2Fic%25C3%25B4ne-de-ligne-de-prescription-design-pixel-parfait-trait-modifiable-logo-signe-symbole.jpg%3Fs%3D170667a%26w%3D0%26k%3D20%26c%3DF__6hOGeg_uZrs9IBzJunFzI6HuTAYU5qLc-oVJPuhY%3D&action=click

[20] Yahoo Images. n.d. “pixel ringing phone game.” Retrieved April 11, 2026 from https://ca.images.search.yahoo.com/search/images;_ylt=AwrNah6pHcpp6KsXyU_tFAx.;_ylu=c2VjA3NlYXJjaARzbGsDYnV0dG9u;_ylc=X1MDMjExNDcyMTAwNQRfcgMyBGZyA21jYWZlZQRmcjIDcDpzLHY6aSxtOnNiLXRvcARncHJpZANGOEhyaFBVQ1JGaUdvNUFaRVRKVUlBBG5fcnNsdAMwBG5fc3VnZwMwBG9yaWdpbgNjYS5pbWFnZXMuc2VhcmNoLnlhaG9vLmNvbQRwb3MDMARwcXN0cgMEcHFzdHJsAzAEcXN0cmwDMjQEcXVlcnkDcGl4ZWwlMjByaW5naW5nJTIwcGhvbmUlMjBnYW1lBHRfc3RtcAMxNzc0ODUzNTYx?p=pixel+ringing+phone+game&fr=mcafee&fr2=p%3As%2Cv%3Ai%2Cm%3Asb-top&ei=UTF-8&x=wrt#id=59&iurl=https%3A%2F%2Fimg.icons8.com%2Fcolor%2F1200%2Fringing-phone.jpg&action=click

[21] Yahoo Images. n.d. “pixel office floor top down png.” Retrieved April 11, 2026 from https://ca.images.search.yahoo.com/search/images;_ylt=Awrilt6S5Mtp.gIAFlLrFAx.;_ylu=Y29sbwNiZjEEcG9zAzEEdnRpZAMEc2VjA3BpdnM-?p=pixel+office+floor+top+down+png&fr2=piv-web&type=E210CA885G0&fr=mcafee#id=82&iurl=https%3A%2F%2Fi.pinimg.com%2Foriginals%2Fc6%2Fa4%2F75%2Fc6a47533567533d7eb19209983b773e8.jpg&action=click

[22] Yahoo Images. n.d. “pixel coffee area.” Retrieved April 11, 2026 from https://ca.images.search.yahoo.com/search/images;_ylt=AwrEoDMaPMppRQIAvrPrFAx.;_ylu=Y29sbwNiZjEEcG9zAzEEdnRpZAMEc2VjA3BpdnM-?p=pixel+coffee+area&fr2=piv-web&type=E210CA885G0&fr=mcafee#id=19&iurl=https%3A%2F%2Fwww.megavoxels.com%2Fwp-content%2Fuploads%2F2024%2F07%2FPixel-Art-Coffee-6.webp&action=click

[23] Yahoo Images. n.d. “pixel sofa game.” Retrieved April 11, 2026 from https://ca.images.search.yahoo.com/search/images;_ylt=AwrFGWyjPMppcwUbnxrtFAx.;_ylu=c2VjA3NlYXJjaARzbGsDYnV0dG9u;_ylc=X1MDMjExNDcyMTAwNQRfcgMyBGZyA21jYWZlZQRmcjIDcDpzLHY6aSxtOnNiLXRvcARncHJpZANPbHZlRUpBRVRSSy4xdTVYbGZteDJBBG5fcnNsdAMwBG5fc3VnZwMzBG9yaWdpbgNjYS5pbWFnZXMuc2VhcmNoLnlhaG9vLmNvbQRwb3MDMARwcXN0cgMEcHFzdHJsAzAEcXN0cmwDMTUEcXVlcnkDcGl4ZWwlMjBzb2ZhJTIwZ2FtZQR0X3N0bXADMTc3NDg2MTQ3OQ--?p=pixel+sofa+game&fr=mcafee&fr2=p%3As%2Cv%3Ai%2Cm%3Asb-top&ei=UTF-8&x=wrt&type=E210CA885G0#id=7&iurl=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F049%2F401%2F986%2Fnon_2x%2Fpixel-art-illustration-sofa-pixelated-sofa-sofa-chair-pixelated-for-the-pixel-art-game-and-icon-for-website-and-game-old-school-retro-vector.jpg&action=click

[24] Yahoo Images. n.d. “pixel computer.” Retrieved April 11, 2026 from https://ca.images.search.yahoo.com/search/images;_ylt=AwrEoDPvPMppNAIAvzbrFAx.;_ylu=Y29sbwNiZjEEcG9zAzEEdnRpZAMEc2VjA3BpdnM-?p=pixel+computer&fr2=piv-web&type=E210CA885G0&fr=mcafee#id=11&iurl=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fthumbnails%2F021%2F195%2F107%2Fsmall_2x%2Fa-laptop-with-blank-screen-in-pixel-art-style-vector.jpg&action=click

[25] Yahoo Images. n.d. “pixel ringing phone.” Retrieved April 11, 2026 from https://ca.images.search.yahoo.com/search/images;_ylt=AwrFGWw1PcppHU0ZW6vtFAx.;_ylu=c2VjA3NlYXJjaARzbGsDYnV0dG9u;_ylc=X1MDMjExNDcyMTAwNQRfcgMyBGZyA21jYWZlZQRmcjIDcDpzLHY6aSxtOnNiLXRvcARncHJpZANpcEVEYXR2cFFlLmVBVmdVaENXSkJBBG5fcnNsdAMwBG5fc3VnZwM0BG9yaWdpbgNjYS5pbWFnZXMuc2VhcmNoLnlhaG9vLmNvbQRwb3MDMARwcXN0cgMEcHFzdHJsAzAEcXN0cmwDMTkEcXVlcnkDcGl4ZWwlMjByaW5naW5nJTIwcGhvbmUEdF9zdG1wAzE3NzQ4NjE2MzA-?p=pixel+ringing+phone&fr=mcafee&fr2=p%3As%2Cv%3Ai%2Cm%3Asb-top&ei=UTF-8&x=wrt&type=E210CA885G0#id=9&iurl=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fthumbnails%2F042%2F556%2F573%2Flarge%2Ftelephone-ringing-green-screen-animation-vintage-retro-telephone-handset-wired-rotary-dial-comics-pop-art-thunder-bolt-incoming-call-on-classic-old-rotary-telephone-free-video.jpg&action=click

[26] Yahoo Images. n.d. “top down pixel office desk png.” Retrieved April 11, 2026 from https://ca.images.search.yahoo.com/search/images;_ylt=AwrEmJny3stpeQIADgDrFAx.;_ylu=Y29sbwNiZjEEcG9zAzEEdnRpZAMEc2VjA3BpdnM-?p=top+down+pixel+office+desk+png&fr2=piv-web&type=E210CA885G0&fr=mcafee#id=12&iurl=https%3A%2F%2Fwww.shutterstock.com%2Fimage-vector%2Fold-copy-office-equipment-pixel-260nw-2392850351.jpg&action=click

[27] Yahoo Images. n.d. “pixel notes.” Retrieved April 11, 2026 from https://ca.images.search.yahoo.com/search/images;_ylt=AwrFBFQUP8ppXZAbYWrtFAx.;_ylu=c2VjA3NlYXJjaARzbGsDYnV0dG9u;_ylc=X1MDMjExNDcyMTAwNQRfcgMyBGZyA21jYWZlZQRmcjIDcDpzLHY6aSxtOnNiLXRvcARncHJpZANMT1R6bFhGUVIuQ0ZXb1cwR21zYjJBBG5fcnNsdAMwBG5fc3VnZwM0BG9yaWdpbgNjYS5pbWFnZXMuc2VhcmNoLnlhaG9vLmNvbQRwb3MDMARwcXN0cgMEcHFzdHJsAzAEcXN0cmwDMTEEcXVlcnkDcGl4ZWwlMjBub3RlcwR0X3N0bXADMTc3NDg2MjI0OQ--?p=pixel+notes&fr=mcafee&fr2=p%3As%2Cv%3Ai%2Cm%3Asb-top&ei=UTF-8&x=wrt&type=E210CA885G0#id=13&iurl=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F035%2F082%2F136%2Flarge_2x%2Fpixel-art-illustration-to-do-list-pixelated-note-checklist-to-so-list-note-test-pixelated-for-the-pixel-art-game-and-icon-for-website-and-video-game-old-school-retro-vector.jpg&action=click

[28] Yahoo Images. n.d. “pixel flag.” Retrieved April 11, 2026 from https://ca.images.search.yahoo.com/search/images;_ylt=AwrFGHzXP8ppHXMQBz8WFQx.;_ylu=Y29sbwNiZjEEcG9zAzEEdnRpZAMEc2VjA3BpdnM-?p=pixel+flag&fr2=p%3As%2Cv%3Ai%2Cm%3Apivot&fr=mcafee#id=1&iurl=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F010%2F967%2F974%2Foriginal%2Fflag-pixel-art-free-vector.jpg&action=click

[29] Yahoo Images. n.d. “communicate pixel.” Retrieved April 11, 2026 from https://ca.images.search.yahoo.com/search/images;_ylt=AwrNah5eQMppbxocg3LtFAx.;_ylu=c2VjA3NlYXJjaARzbGsDYnV0dG9u;_ylc=X1MDMjExNDcyMTAwNQRfcgMyBGZyA21jYWZlZQRmcjIDcDpzLHY6aSxtOnNiLXRvcARncHJpZANVd2RDSDNzdVR0eVhFREE3NXdWZmhBBG5fcnNsdAMwBG5fc3VnZwMxMARvcmlnaW4DY2EuaW1hZ2VzLnNlYXJjaC55YWhvby5jb20EcG9zAzAEcHFzdHIDBHBxc3RybAMwBHFzdHJsAzE3BHF1ZXJ5A2NvbW11bmljYXRlJTIwcGl4ZWwEdF9zdG1wAzE3NzQ4NjI0MzY-?p=communicate+pixel&fr=mcafee&fr2=p%3As%2Cv%3Ai%2Cm%3Asb-top&ei=UTF-8&x=wrt&type=E210CA885G0#id=1&iurl=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F010%2F429%2F576%2Fnon_2x%2Fpixel-communication-bubble-free-vector.jpg&action=click

[30] Google Images. n.d. “dark wood texture png.” Retrieved April 11, 2026 from https://www.google.com/search?sca_esv=d525e7905da52187&rlz=1C1ONGR_enCA1073CA1073&sxsrf=ANbL-n4iDuAReAA2e7WjTKUCxjeDzftscg:1774934309365&udm=2&fbs=ADc_l-aN0CWEZBOHjofHoaMMDiKpaEWjvZ2Py1XXV8d8KvlI3o6iwGk6Iv1tRbZIBNIVs-5-bUj3iBl-UxHsANYwOkWWIHyK1NRBVtxaVLlI368r1i_oJNJbNHH_ktlD_XjiVCI03ZDXM7y_VFtGu7DAr_a0R6-bhZAHApsWNCGNdTCLu3sYo6dkyLNlUgwMgFmGUN46JsCDdWXxYYyI4APbX8QdbDdQvA&q=dark+wood+texture+png&sa=X&ved=2ahUKEwj7q4nIscmTAxWftokEHemEIAUQtKgLegQIEBAB&biw=2560&bih=1305&dpr=1#sv=CAMSVhoyKhBlLTRIckxSWlpVWVNuZFFNMg40SHJMUlpaVVlTbmRRTToOMHh0RHpkNVJDYUpHSk0gBCocCgZtb3NhaWMSEGUtNEhyTFJaWlVZU25kUU0YADABGAcgwLCE-QdKCBABGAEgASgB

[31] Google Images. n.d. “office wall texture.” Retrieved April 11, 2026 from https://www.google.com/search?sca_esv=3e2b86a70d6d9be2&rlz=1C1ONGR_enCA1073CA1073&sxsrf=ANbL-n4fmiipjAyapM85KYDr3TIXBz8LvQ:1774935142082&udm=2&fbs=ADc_l-aN0CWEZBOHjofHoaMMDiKpaEWjvZ2Py1XXV8d8KvlI3o6iwGk6Iv1tRbZIBNIVs-5-bUj3iBl-UxHsANYwOkWWIHyK1NRBVtxaVLlI368r1pVkTF8dikqaIUDHe6ZJqgqLED0lHKH6ZUPrTLm_BL6mzKIQ3bG80B6TNdyCQyVh3IZLIRudqOLqctxvtBtXmaDxZyatytspieJs3Xkjay6-vKfOVQ&q=office+wall+texture&sa=X&ved=2ahUKEwiBppLVtMmTAxUqF1kFHU3yFE8QtKgLegQIERAB&biw=2560&bih=1305&dpr=1#sv=CAMSVhoyKhBlLUM5QjlOaXNqX2VTaElNMg5DOUI5Tmlzal9lU2hJTToObkR1QnFjTG1GOHZKdk0gBCocCgZtb3NhaWMSEGUtQzlCOU5pc2pfZVNoSU0YADABGAcgx4Pp6g1KCBABGAEgASgB

[32] Google Images. n.d. “red brick wall pixel texture.” Retrieved April 11, 2026 from https://www.google.com/search?q=red+brick+wall+pixel+texture&sca_esv=3e2b86a70d6d9be2&rlz=1C1ONGR_enCA1073CA1073&udm=2&biw=2560&bih=1305&sxsrf=ANbL-n55ateX5LYFyN5R-lnGKAzdzP8E7w%3A1774935212931&ei=rFzLac26OLWw5NoP56SYwAk&ved=0ahUKEwjNwPb2tMmTAxU1GFkFHWcSBpgQ4dUDCBI&uact=5&oq=red+brick+wall+pixel+texture&gs_lp=Egtnd3Mtd2l6LWltZyIccmVkIGJyaWNrIHdhbGwgcGl4ZWwgdGV4dHVyZUicOlDRIlizOXADeACQAQCYATygAfwCqgEBN7gBA8gBAPgBAZgCA6ACBsICBhAAGAcYHsICChAAGIAEGIoFGEPCAgUQABiABMICBBAAGB6YAwCIBgGSBwEzoAdUsgcAuAcAwgcDMC4zyAcFgAgB&sclient=gws-wiz-img#sv=CAMSXhoyKhBlLVFHUExTa2xOS1NQcVJNMg5RR1BMU2tsTktTUHFSTToOd250Q09pdjNobVlzME0gBCokCg5iblNwZmdqVHpwVUFUTRIQZS1RR1BMU2tsTktTUHFSTRgAMAEYByDw5a3kD0oIEAEYASABKAE

[33] Google Images. n.d. “top down bedsidepixel table png.” Retrieved April 11, 2026 from https://www.google.com/search?q=top+down+bedsidepixel+table+png&sca_esv=3e2b86a70d6d9be2&rlz=1C1ONGR_enCA1073CA1073&udm=2&biw=2560&bih=1305&sxsrf=ANbL-n4pugbw0VHgFt4Ipotw968i1zZV_A%3A1774936277082&ei=1WDLaeDbBJSdptQPq_H_wAc&ved=0ahUKEwigmq3yuMmTAxWUjokEHav4H3gQ4dUDCBI&uact=5&oq=top+down+bedsidepixel+table+png&gs_lp=Egtnd3Mtd2l6LWltZyIfdG9wIGRvd24gYmVkc2lkZXBpeGVsIHRhYmxlIHBuZ0i0PVCsHFjOO3ACeACQAQCYATygAcACqgEBNrgBA8gBAPgBAZgCAKACAJgDAIgGAZIHAKAHSLIHALgHAMIHAMgHAIAIAQ&sclient=gws-wiz-img#sv=CAMSXhoyKhBlLWFtbU9mYnkxZ2VmWVJNMg5hbW1PZmJ5MWdlZllSTToOMXZDcFhpSFh1RnpuSk0gBCokCg5ISUllbHBaYkhkV0ltTRIQZS1hbW1PZmJ5MWdlZllSTRgAMAEYByCT39zZC0oIEAEYASABKAE

[34] Google Images. n.d. “top down pixel tv stand png.” Retrieved April 11, 2026 from https://www.google.com/search?sca_esv=3e2b86a70d6d9be2&rlz=1C1ONGR_enCA1073CA1073&sxsrf=ANbL-n67V7s1c0qmCL-VMnV8CIt8IXSC5A:1774937085824&udm=2&fbs=ADc_l-aN0CWEZBOHjofHoaMMDiKpaEWjvZ2Py1XXV8d8KvlI3p-ML-906rRL_m6h4jR-tdCeKIwp94h-QiJ4lJfObsqUPixp6KuAej6LdEw-ul8fuSja_tiDhjZeIPWuJxM7b7q1xAzDf1wlIQN7LXaHr0C8Yr2Mr-FOqMvhY3kMXyHIr83Ps1H3Ed2cFA9LW_ekqb6RsJxc4ZnSgSx4UQG8HPzAFx5SdQ&q=top+down+pixel+tv+stand+png&sa=X&ved=2ahUKEwi28_7zu8mTAxUDD1kFHXmGLEcQtKgLegQIDxAB&biw=2560&bih=1305#sv=CAMSXhoyKhBlLUxFWE85RWRQOUlaUWVNMg5MRVhPOUVkUDlJWlFlTToOOFJWYnk2ZFZQcWt5SU0gBCokCg55bHMzVHNxblhZWnJOTRIQZS1MRVhPOUVkUDlJWlFlTRgAMAEYByCB8L_SD0oIEAEYASABKAE

[35] Google Images. n.d. “top down pixel couch png.” Retrieved April 11, 2026 from https://www.google.com/search?sca_esv=3e2b86a70d6d9be2&rlz=1C1ONGR_enCA1073CA1073&sxsrf=ANbL-n5NxOlMHKieAdx2HecpAzfbf0X4cA:1774937164395&udm=2&fbs=ADc_l-aN0CWEZBOHjofHoaMMDiKpaEWjvZ2Py1XXV8d8KvlI3o6iwGk6Iv1tRbZIBNIVs-5-bUj3iBl-UxHsANYwOkWWQqZAJJdwuRaSoLHfELMHAQFneUwKM50jpvR3lgPoPKPocSAVLVIC1tmtj18NQh34sJoMKkeMLmVT0BQXR6brJvbElwncIYMxPc2e7aIP7xyAYnsJEw_6y0zcNxiTmikcViftsA&q=top+down+pixel+couch+png&sa=X&ved=2ahUKEwjXwLqZvMmTAxVzEGIAHYJANmsQtKgLegQIFBAB&biw=2560&bih=1305&dpr=1#sv=CAMSVhoyKhBlLXE5YXhCU1NLdUwtSDVNMg5xOWF4QlNTS3VMLUg1TToONXNwODlsTWZIaFBXTU0gBCocCgZtb3NhaWMSEGUtcTlheEJTU0t1TC1INU0YADABGAcg6sC2mAZKCBABGAEgASgB

[36] PNGTree. n.d. “Kitchen top view.” Retrieved April 11, 2026 from https://pngtree.com/freepng/kitchen-top-view_7069708.html

[37] Imgbin. n.d. “Top down dining table.” Retrieved April 11, 2026 from https://imgbin.com/free-png/top-down-dining-table

[38] Google Images. n.d. “top down pixel shoe rack png.” Retrieved April 11, 2026 from https://www.google.com/search?sca_esv=3e2b86a70d6d9be2&rlz=1C1ONGR_enCA1073CA1073&sxsrf=ANbL-n4gU1d5dmH5-OCtDKbvPmXcxkXhqw:1774937416594&udm=2&fbs=ADc_l-aN0CWEZBOHjofHoaMMDiKpaEWjvZ2Py1XXV8d8KvlI3o6iwGk6Iv1tRbZIBNIVs-5-bUj3iBl-UxHsANYwOkWWIHyK1NRBVtxaVLlI368r1i_oJNJbNHH_ktlD_XjiVCK8P-liMcesKv3yIAxbBSwGGryIzQoplnpoUkVEziaLvzCeXPDjzb6HHl7LdXDKL-aYy9TXqcxqQ2B7DrPj4CseygTa6Q&q=top+down+pixel+shoe+rack+png&sa=X&ved=2ahUKEwjevduRvcmTAxWgGlkFHYtAEzkQtKgLegQIDxAB&cshid=1774937549616150&biw=2560&bih=1305&dpr=1#sv=CAMSXhoyKhBlLWJESnlOSXJDN3VoN0xNMg5iREp5TklyQzd1aDdMTToOWWR2VGhtNUlVSHlOYU0gBCokCg5BbnlSeElZc3YxbXJ6TRIQZS1iREp5TklyQzd1aDdMTRgAMAEYByDij9i0BkoIEAEYASABKAE

[39] Google Images. n.d. “pixel bush top down png.” Retrieved April 11, 2026 from https://www.google.com/search?sca_esv=816abb5a51ae04a7&rlz=1C1ONGR_enCA1073CA1073&sxsrf=ANbL-n61Vbjhlmsw_MUQL2YtK-cEVi7_3g:1774939562601&udm=2&fbs=ADc_l-aN0CWEZBOHjofHoaMMDiKpaEWjvZ2Py1XXV8d8KvlI3jljrY5CkLlk8Dq3IvwBz-Qg9gdZYJriKd9fBMKKfwqZsp5a2Z8RykAyI8QON1GKtNJOssmbpPvaOpAriL5ZmTwtx9B17VeAaoqb-qf2R_XTlcg6QIT-dCFYKZUSMNTtLZ72W3kEX7yJunhV8fObfw2b2yNqJD-ZmRex00cp8ruSqBTbIg&q=pixel+bush+top+down+png&sa=X&ved=2ahUKEwj8sIGRxcmTAxWEVjUKHcD8OXUQtKgLegQIDBAB&biw=2560&bih=1305&dpr=1#sv=CAMSVhoyKhBlLVdGUUhNRmhKT0ZZLWVNMg5XRlFITUZoSk9GWS1lTToOMUdZbEVsTWR0UWNXYk0gBCocCgZtb3NhaWMSEGUtV0ZRSE1GaEpPRlktZU0YADABGAcgpMri3w5KCBABGAEgASgB

[40] Google Images. n.d. “pixel shopping cart top down png.” Retrieved April 11, 2026 from https://www.google.com/search?sca_esv=816abb5a51ae04a7&rlz=1C1ONGR_enCA1073CA1073&sxsrf=ANbL-n4nDo03nvfuRQI_JgNxsJ6vzmaVyw:1774939791463&udm=2&fbs=ADc_l-aN0CWEZBOHjofHoaMMDiKpaEWjvZ2Py1XXV8d8KvlI3o6iwGk6Iv1tRbZIBNIVs-5-bUj3iBl-UxHsANYwOkWWIHyK1NRBVtxaVLlI368r1pVkTF8dikqaIUDHe6ZJqgrtGKFguRwxeugWaDc6vA-ZCHR8WPXxHUpvaC4AqgGAe29vMyS3iHy8YkqMAmfHYvNDaUPlZQ6fkk7aiPg8XCKDo9WRwA&q=pixel+shopping+cart+top+down+png&sa=X&ved=2ahUKEwjV-5H-xcmTAxWkLFkFHfPXCQ8QtKgLegQIDxAB&biw=2560&bih=1305&dpr=1#sv=CAMSXhoyKhBlLVNNU2NDN0ZtNHJtR0VNMg5TTVNjQzdGbTRybUdFTToOSWt0NjhManl2V2RjTE0gBCokCg5taFA4VXRnMU52YUpnTRIQZS1TTVNjQzdGbTRybUdFTRgAMAEYByDx34zQCEoIEAEYASABKAE

[41] Google Images. n.d. “pixel trash can top down png.” Retrieved April 11, 2026 from https://www.google.com/search?sca_esv=816abb5a51ae04a7&rlz=1C1ONGR_enCA1073CA1073&sxsrf=ANbL-n6wibZiSDo20z0JQ_vSs_yBTy-glw:1774939683116&udm=2&fbs=ADc_l-aN0CWEZBOHjofHoaMMDiKpaEWjvZ2Py1XXV8d8KvlI3p-ML-906rRL_m6h4jR-tdCeKIwp94h-QiJ4lJfObsqUPixp6KuAej6LdEw-ul8fud3FiyoYcNHDn3HZ8mQ6T-ckdOlkfthMcAd5uMRwsZYjn_umCTETpZ0MlqjQ3jj6aU2YNhF3WIfCt5zMJugIboT7gnQP7QtzrBFLK8H8LGGlhRBepA&q=pixel+trash+can+top+down+png&sa=X&ved=2ahUKEwiK-7zKxcmTAxW4MlkFHaQ4BJ4QtKgLegQIChAB&biw=2560&bih=1305&dpr=1#sv=CAMSVhoyKhBlLXczRmJIbEhrcGFadExNMg53M0ZiSGxIa3BhWnRMTToORmJQaHg4cmJualdobU0gBCocCgZtb3NhaWMSEGUtdzNGYkhsSGtwYVp0TE0YADABGAcgq7bE4ApKCBABGAEgASgB

[42] Google Images. n.d. “pixel fire hydrant top down png.” Retrieved April 11, 2026 from https://www.google.com/search?sca_esv=816abb5a51ae04a7&rlz=1C1ONGR_enCA1073CA1073&sxsrf=ANbL-n4xvDeT4WbOQ3pLB8GRNwVhdRSpfw:1774939644499&udm=2&fbs=ADc_l-aN0CWEZBOHjofHoaMMDiKpaEWjvZ2Py1XXV8d8KvlI3vWUtYx0DZdicpfE1faGYemg2KC4yuMPyQlIvlWqq2At2yMvCZgi_bwXXU0sv2NZz1ci8vvXN7qvH5d5H0L2gzDVa8EQXPOe03G6oWgM1i7mQuRVJZMw63JPM9jizs0p2p0CKnW3p6_iMTGuk3xLMjYD_G_SYUdHsIciM1dHUgViogBHUA&q=pixel+fire+hydrant+top+down+png&sa=X&ved=2ahUKEwjUgIi4xcmTAxWRFmIAHX-iNoYQtKgLegQIChAB&biw=2560&bih=1305&dpr=1#sv=CAMSVhoyKhBlLU13MXBBZnpVdGtRUm5NMg5NdzFwQWZ6VXRrUVJuTToOU0xQdUFOUzB0Z0xGQk0gBCocCgZtb3NhaWMSEGUtTXcxcEFmelV0a1FSbk0YADABGAcgz8jn4g1KCBABGAEgASgB

[43] Yahoo Images. n.d. “top down pixel filing cabinet png.” Retrieved April 11, 2026 from https://ca.images.search.yahoo.com/search/images;_ylt=AwrFGWwt3stp5BcAEZntFAx.;_ylu=c2VjA3NlYXJjaARzbGsDYnV0dG9u;_ylc=X1MDMjExNDcyMTAwNQRfcgMyBGZyA21jYWZlZQRmcjIDcDpzLHY6aSxtOnNiLXRvcARncHJpZANKczlFZElHcVQ3ZVNNa0w5NlZRM2lBBG5fcnNsdAMwBG5fc3VnZwMxMARvcmlnaW4DY2EuaW1hZ2VzLnNlYXJjaC55YWhvby5jb20EcG9zAzAEcHFzdHIDBHBxc3RybAMwBHFzdHJsAzMzBHF1ZXJ5A3RvcCUyMGRvd24lMjBwaXhlbCUyMGZpbGluZyUyMGNhYmluZXQlMjBwbmcEdF9zdG1wAzE3NzQ5NjgzNzk-?p=top+down+pixel+filing+cabinet+png&fr=mcafee&fr2=p%3As%2Cv%3Ai%2Cm%3Asb-top&ei=UTF-8&x=wrt&type=E210CA885G0#id=2&iurl=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F023%2F875%2F362%2Fnon_2x%2Foffice-file-cabinet-game-pixel-art-illustration-vector.jpg&action=click

[44] Yahoo Images. n.d. “top down pixel recycle trash bin png.” Retrieved April 11, 2026 from https://ca.images.search.yahoo.com/search/images;_ylt=Awrig3rD38tpehoEsg7tFAx.;_ylu=c2VjA3NlYXJjaARzbGsDYnV0dG9u;_ylc=X1MDMjExNDcyMTAwNQRfcgMyBGZyA21jYWZlZQRmcjIDcDpzLHY6aSxtOnNiLXRvcARncHJpZANvR2VfZkFFSVNnNlp3Q3F1Z0U0N2FBBG5fcnNsdAMwBG5fc3VnZwMwBG9yaWdpbgNjYS5pbWFnZXMuc2VhcmNoLnlhaG9vLmNvbQRwb3MDMARwcXN0cgMEcHFzdHJsAzAEcXN0cmwDMzYEcXVlcnkDdG9wJTIwZG93biUyMHBpeGVsJTIwcmVjeWNsZSUyMHRyYXNoJTIwYmluJTIwcG5nBHRfc3RtcAMxNzc0OTY4Nzky?p=top+down+pixel+recycle+trash+bin+png&fr=mcafee&fr2=p%3As%2Cv%3Ai%2Cm%3Asb-top&ei=UTF-8&x=wrt&type=E210CA885G0#id=40&iurl=https%3A%2F%2Fimages.rawpixel.com%2Fimage_png_800%2FcHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L3BmLWljb24yLWFrZTA0NjktamotbC1qb2I3ODgtMy5wbmc.png&action=click

[45] Yahoo Images. n.d. “top down pixel office desk png.” Retrieved April 11, 2026 from https://ca.images.search.yahoo.com/search/images;_ylt=AwrEstVh4MtpGgIApjrrFAx.;_ylu=Y29sbwNiZjEEcG9zAzEEdnRpZAMEc2VjA3BpdnM-?p=top+down+pixel+office+desk+png&fr2=piv-web&type=E210CA885G0&fr=mcafee#id=52&iurl=https%3A%2F%2Fw7.pngwing.com%2Fpngs%2F853%2F837%2Fpng-transparent-chair-office-fig-flat-color-office-chair-desk-chair-angle-color-splash-furniture.png&action=click

[46] Deltarune Wiki. n.d. “Watercooler battle idle.” Retrieved April 11, 2026 from https://deltarune.wiki/images/Watercooler_battle_idle.png?cb=c98ir5&h=thumb.php&f=Watercooler_battle_idle.png

[47] Yahoo Images. n.d. “fridge pixel.” Retrieved April 11, 2026 from https://ca.images.search.yahoo.com/search/images;_ylt=AwrFGWwv68tpfO8BJwHtFAx.;_ylu=c2VjA3NlYXJjaARzbGsDYnV0dG9u;_ylc=X1MDMjExNDcyMTAwNQRfcgMyBGZyA21jYWZlZQRmcjIDcDpzLHY6aSxtOnNiLXRvcARncHJpZANzR2FkZk9GSlRtZTVSaFh0STc5ZEVBBG5fcnNsdAMwBG5fc3VnZwMxMARvcmlnaW4DY2EuaW1hZ2VzLnNlYXJjaC55YWhvby5jb20EcG9zAzAEcHFzdHIDBHBxc3RybAMwBHFzdHJsAzEzBHF1ZXJ5A2ZyaWRnZSUyMHBpeGVsJTIwBHRfc3RtcAMxNzc0OTcxNzQw?p=fridge+pixel+&fr=mcafee&fr2=p%3As%2Cv%3Ai%2Cm%3Asb-top&ei=UTF-8&x=wrt&type=E210CA885G0#id=1&iurl=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F005%2F146%2F413%2Flarge_2x%2Frefrigerator-pixel-art-free-vector.jpg&action=click

[48] Google Images. n.d. “pixel file stack png.” Retrieved April 11, 2026 from https://www.google.com/search?sca_esv=b78cf8500232fcdc&rlz=1C1ONGR_enCA1073CA1073&sxsrf=ANbL-n78dUml95w8fltAiU89JeLcu580Dw:1775090008085&udm=2&fbs=ADc_l-aN0CWEZBOHjofHoaMMDiKpaEWjvZ2Py1XXV8d8KvlI3p-ML-906rRL_m6h4jR-tdCeKIwp94h-QiJ4lJfObsqU79yRFgWBtc5FGpXu1cRl7WMsuLbm9eXF2miyzQA_QJ-KLUyb79IO5IlA-PPacG7YkvHaSyBe-dy6hthtWjStMQiZ2RD9OtPsgS3IsqZY70yeSJQNP8JwOLf8cwuCDIzkjkYbxQ&q=pixel+file+stack+png&sa=X&ved=2ahUKEwit_oDL9c2TAxXnNt4AHeuiEqAQtKgLegQIDRAB&cshid=1775090034370337&biw=2560&bih=1305&dpr=1#sv=CAMSXhoyKhBlLU90OE9xV21yT3p0bjVNMg5PdDhPcVdtck96dG41TToOS3ZFVlY2RWxOcWFwSk0gBCokCg56T050LWp5MFBLV2dDTRIQZS1PdDhPcVdtck96dG41TRgAMAEYByCu1JCyAkoIEAEYASABKAE

[49] Vecteezy. n.d. “Pixel art cartoon office man character.” Retrieved April 11, 2026 from https://www.vecteezy.com/png/27517373-pixel-art-cartoon-office-man-character
