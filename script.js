const video = document.getElementById("video");
const list = document.getElementById("list");
const search = document.getElementById("search");
const drawer = document.getElementById("channels");

let hls = null;
let shakaPlayer = null;
let currentChannel = null;

/* MOBILE CHECK */
function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

/* RESIZE */
function resizeVideo(isFS=false) {
    if (isMobile() && innerWidth > innerHeight) {
        video.style.objectFit = isFS ? "contain" : "cover";
    } else {
        video.style.objectFit = "contain";
    }
}
addEventListener("resize", ()=>resizeVideo(!!document.fullscreenElement));
addEventListener("orientationchange", ()=>resizeVideo(!!document.fullscreenElement));

/* CHANNEL LIST */
const channels = [{
    id: "sdtvnetwork",
    name: "SDTV Network",
    type: "m3u8",
    logo: "https://i.imgur.com/gzQ9sFM.jpeg",
    src: "https://live20.bozztv.com/giatv/giatv-sdtvglobalnew/sdtvglobalnew/playlist.m3u8"
}, {
    id: "sdtv",
    name: "SDTV",
    type: "m3u8",
    logo: "https://i.imgur.com/acWxDo4.jpeg",
    src: "https://live20.bozztv.com/giatvplayout7/giatv-211473/tracks-v1a1/mono.ts.m3u8"
}, {
    id: "sdtvradio",
    name: "SDTV Radio",
    type: "m3u8",
    logo: "https://i.imgur.com/VOBlE8Y.jpeg",
    src: "https://usa2.server2028.com/hls/sdtv_radio/live.m3u8"
}, {
    id: "sineplus",
    name: "SinePlus",
    type: "m3u8",
    logo: "https://i.imgur.com/2pZc85x.png",
    src: "https://live20.bozztv.com/giatvplayout7/giatv-208591/tracks-v1a1/mono.ts.m3u8"
}, {
    id: "alltv2",
    name: "ALLTV2",
    type: "mpd",
    drm: "clearkey",
    keyId: "31363233323238353336303333363036",
    key: "367662564c69425947353948374f4553",
    logo: "https://i.imgur.com/9093ago.jpeg",
    src: "https://converse.nathcreqtives.com/1179/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJNb29uIiwiaWF0IjoxNzczMDE1NjMzLCJleHAiOjE3NzQwNzc2NTgsImFjY291bnRFeHBpcmVkIjpmYWxzZSwiYWNjb3VudEV4cGlyZXNBdCI6MTc3NDA3NzY1OH0.rIytn71LR0JrQotL7kVoIPO3ppFXjERc9GpbbUhmm9w"
}, {
    id: "jeepney-tv",
    name: "Jeepney Tv",
    type: "mpd",
    drm: "clearkey",
    keyId: "dc9fec234a5841bb8d06e92042c741ec",
    key: "225676f32612dc803cb4d0f950d063d0",
    logo: "https://i.imgur.com/d7VflLp.jpeg",
    src: "https://abslive.akamaized.net/dash/live/2027618/jeepneytv/manifest.mpd"
}, {
    id: "hype-tv",
    name: "HypeTV",
    type: "m3u8",
    logo: "https://i.imgur.com/99tjuaF.png",
    src: "https://live20.bozztv.com/giatvplayout7/giatv-211468/tracks-v1a1/mono.ts.m3u8"
}, {
    id: "golden-tv",
    name: "Golden Tv",
    type: "m3u8",
    logo: "https://i.imgur.com/9EGqMKY.jpeg",
    src: "https://goldentelevisionnetwork.sanmateocable.workers.dev/playlist.m3u8"
}, {
    id: "cineplex-asia",
    name: "Cineplex Asia",
    type: "m3u8",
    logo: "https://i.imgur.com/YuNuJCG.png",
    src: "https://live20.bozztv.com/giatvplayout7/giatv-210632/tracks-v1a1/mono.ts.m3u8"
}, {
    id: "3rs-sine-pinoy",
    name: "3rs Sine Pinoy",
    type: "m3u8",
    logo: "https://i.imgur.com/RS1PrEo.png",
    src: "https://live20.bozztv.com/giatvplayout7/giatv-210267/tracks-v1a1/mono.ts.m3u8"
}, {
    id: "3rs-moviebox",
    name: "3rs MovieBox",
    type: "m3u8",
    logo: "https://i.imgur.com/b4rjf8n.png",
    src: "https://live20.bozztv.com/giatvplayout7/giatv-210731/tracks-v1a1/mono.ts.m3u8"
}, {
    id: "3rs-tv",
    name: "3rs Tv",
    type: "m3u8",
    logo: "https://i.imgur.com/50RyQA7.jpeg",
    src: "https://live20.bozztv.com/giatvplayout7/giatv-210631/tracks-v1a1/mono.ts.m3u8"
}, {
    id: "juzt-tv",
    name: "Juzt Tv",
    type: "m3u8",
    logo: "https://i.imgur.com/HmK3hm3.png",
    src: "https://live20.bozztv.com/giatvplayout7/giatv-210639/tracks-v1a1/mono.ts.m3u8"
}, {
    id: "jpvradio",
    name: "Jpv Radio",
    type: "m3u8",
    logo: "https://i.imgur.com/MDXJpUv.jpeg",
    src: "https://usa2.server2028.com/hls/jpv_radio/live.m3u8"
}, {
    id: "tv5",
    name: "Tv5",
    type: "mpd",
    drm: "clearkey",
    keyId: "31363231383438303333323033373730",
    key: "375a684a31357647653565574b363076",
    logo: "https://ottepg8.comclark.com:8443/iptvepg/images/markurl/mark_1723134335547.png",
    src: "https://converse.nathcreqtives.com/1088/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJNb29uIiwiaWF0IjoxNzczMDE1NjMzLCJleHAiOjE3NzQwNzc2NTgsImFjY291bnRFeHBpcmVkIjpmYWxzZSwiYWNjb3VudEV4cGlyZXNBdCI6MTc3NDA3NzY1OH0.rIytn71LR0JrQotL7kVoIPO3ppFXjERc9GpbbUhmm9w"
}, {
    id: "startvphilippines",
    name: "Star Tv Philippines",
    type: "m3u8",
    logo: "https://i.imgur.com/UXnLJyS.jpeg",
    src: "https://live20.bozztv.com/giatvplayout7/giatv-208168/tracks-v1a1/mono.ts.m3u8"
}, {
    id: "dreamtvphilippines",
    name: "Dream Tv Philippines",
    type: "m3u8",
    logo: "https://i.imgur.com/qnsM57l.png",
    src: "https://live20.bozztv.com/giatvplayout7/giatv-209574/tracks-v1a1/mono.ts.m3u8"
}, {
    id: "tap-silog",
    name: "Tap Silog",
    type: "m3u8",
    logo: "https://i.imgur.com/MuKzASH.jpeg",
    src: "https://tapsilog.honor-tv.42web.io/stream.m3u8"
}, {
    id: "kapamilya",
    name: "Kapamilya",
    type: "mpd",
    drm: "clearkey",
    keyId: "31363331363737343637333533323837",
    key: "71347339457958556439543650426e74",
    logo: "https://i.imgur.com/S2FCXzr.png",
    src: "https://converse.nathcreqtives.com/1286/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJNb29uIiwiaWF0IjoxNzczMDE1NjMzLCJleHAiOjE3NzQwNzc2NTgsImFjY291bnRFeHBpcmVkIjpmYWxzZSwiYWNjb3VudEV4cGlyZXNBdCI6MTc3NDA3NzY1OH0.rIytn71LR0JrQotL7kVoIPO3ppFXjERc9GpbbUhmm9w"
}, {
    id: "kapatid-channel",
    name: "Kapatid Channel",
    type: "mpd",
    drm: "clearkey",
    keyId: "dbf670bed2ea4905a114557e90e7ffb6",
    key: "616059bec8dfb27f3524b7e7c31b6cff",
    logo: "https://i.imgur.com/ov0JO06.jpeg",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/pphd_sdi1/default/index.mpd"
}, {
    id: "rptv",
    name: "Rptv",
    type: "mpd",
    drm: "clearkey",
    keyId: "1917f4caf2364e6d9b1507326a85ead6",
    key: "a1340a251a5aa63a9b0ea5d9d7f67595",
    logo: "https://i.imgur.com/Qh9pMXc.png",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cnn_rptv_prod_hd/default/index.mpd"
}, {
    id: "will-tv",
    name: "Will Tv",
    type: "mpd",
    drm: "clearkey",
    keyId: "b1773d6f982242cdb0f694546a3db26f",
    key: "ae9a90dbea78f564eb98fe817909ec9a",
    logo: "https://i.imgur.com/v87MSbU.png",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/wiltv/default/index.mpd"
}, {
    id: "gma",
    name: "Gma",
    type: "mpd",
    logo: "https://i.imgur.com/z2rl3df.jpeg",
    src: "https://gsattv.akamaized.net/live/media0/gma7/Widevine/gma7.mpd"
}, {
    id: "gtv",
    name: "Gtv",
    type: "mpd",
    logo: "https://i.imgur.com/aeWyCsh.jpeg",
    src: "http://136.239.159.18:6610/001/2/ch00000090990000001143/manifest.mpd?AuthInfo=v87HD9rEhwHiAdYyrP20Tg5pgSMSITY%2FHYvvCWJRp%2BrwAtJC%2BsmBQ5ARU076BdkhytokK1MIobcue1ImXa0ZEA%3D%3D&version=v1.0&BreakPoint=0&virtualDomain=001.live_hls.zte.com&programid=ch00000000000000001313&contentid=ch00000000000000001313&videoid=ch00000090990000001143&recommendtype=0&userid=1590268675436&boid=001&stbid=02%3A00%3A00%3A00%3A00%3A00&terminalflag=1&profilecode=&usersessionid=AAIUZ2MAG7XXXX&NeedJITP=1&JITPMediaType=DASH&JITPDRMType=NO"
}, {
    id: "gmanewstv",
    name: "Gma News Tv",
    type: "m3u8",
    logo: "https://i.imgur.com/3hBz98d.jpeg",
    src: "https://converse.nathcreqtives.com/channels/gmanewstv/playlist.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJNb29uIiwiaWF0IjoxNzcyNTg1NDEyLCJleHAiOjE3NzM4ODE0MTIsImFjY291bnRFeHBpcmVkIjpmYWxzZSwiYWNjb3VudEV4cGlyZXNBdCI6MTc3Mzg4MTQxMn0.pWBHcolaeZXd-5DAkMobbJn5DbFoSTDEWYuQn0LC5U4"
}, {
    id: "kapamilya-channel",
    name: "Kapamilya Channel",
    type: "mpd",
    drm: "clearkey",
    keyId: "bd17afb5dc9648a39be79ee3634dd4b8",
    key: "b475084a1a58857e18480e30fbb0e544",
    logo: "https://i.imgur.com/S2FCXzr.png",
    src: "https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg01006-abs-cbn-kapcha-dash-abscbnono/ccd312c8-e528-40ec-902c-e4205750ed11/index.mpd"
}, {
    id: "msnow",
    name: "Msnow",
    type: "m3u8",
    logo: "https://i.imgur.com/1walfCs.jpeg",
    src: "https://s7.usnlive.com/stream/msnbc.m3u8"
}, {
    id: "moviesnow",
    name: "Movies Now",
    type: "mpd",
    drm: "clearkey",
    keyId: "40f019b86241d23ef075633fd7f1e927",
    key: "058dec845bd340178a388edd104a015e",
    logo: "https://d229kpbsb5jevy.cloudfront.net/timesplay/content/common/logos/channel/logos/wthfwe.jpeg",
    src: "https://times-ott-live.akamaized.net/moviesnow_wv_drm/index.mpd"
}, {
    id: "mnx",
    name: "Mnx",
    type: "mpd",
    drm: "clearkey",
    keyId: "40f019b86241d23ef075633fd7f1e927",
    key: "058dec845bd340178a388edd104a015e",
    logo: "https://i.imgur.com/9QSwrlt.jpeg",
    src: "https://times-ott-live.akamaized.net/mnxhd_wv_drm/index.mpd"
}, {
    id: "mn+",
    name: "Mn+",
    type: "mpd",
    drm: "clearkey",
    keyId: "40f019b86241d23ef075633fd7f1e927",
    key: "058dec845bd340178a388edd104a015e",
    logo: "https://i.imgur.com/1vKAozn.png",
    src: "https://times-ott-live.akamaized.net/mnplus_wv_drm/index.mpd"
}, {
    id: "romedynow",
    name: "Romedy Now",
    type: "mpd",
    drm: "clearkey",
    keyId: "40f019b86241d23ef075633fd7f1e927",
    key: "058dec845bd340178a388edd104a015e",
    logo: "https://i.imgur.com/dkQDLtH.jpeg",
    src: "https://times-ott-live.akamaized.net/romedynow_wv_drm/index.mpd"
}, {
    id: "starmovies",
    name: "Star Movies",
    type: "m3u8",
    logo: "https://i.imgur.com/eJFEVzn.jpeg",
    src: "https://converse.nathcreqtives.com/channels/starmovies/playlist.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJNb29uIiwiaWF0IjoxNzcyNTg1NDEyLCJleHAiOjE3NzM4ODE0MTIsImFjY291bnRFeHBpcmVkIjpmYWxzZSwiYWNjb3VudEV4cGlyZXNBdCI6MTc3Mzg4MTQxMn0.pWBHcolaeZXd-5DAkMobbJn5DbFoSTDEWYuQn0LC5U4"
}, {
    id: "starmoviesselect",
    name: "Star Movies Select",
    type: "m3u8",
    logo: "https://i.imgur.com/0y5TVLv.png",
    src: "https://converse.nathcreqtives.com/channels/smselect/playlist.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJNb29uIiwiaWF0IjoxNzcyNTg1NDEyLCJleHAiOjE3NzM4ODE0MTIsImFjY291bnRFeHBpcmVkIjpmYWxzZSwiYWNjb3VudEV4cGlyZXNBdCI6MTc3Mzg4MTQxMn0.pWBHcolaeZXd-5DAkMobbJn5DbFoSTDEWYuQn0LC5U4"
}, {
    id: "sonypix",
    name: "Sony Pix",
    type: "m3u8",
    logo: "https://i.imgur.com/1CcovSe.jpeg",
    src: "https://converse.nathcreqtives.com/channels/sonypixhd/playlist.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJNb29uIiwiaWF0IjoxNzcyNTg1NDEyLCJleHAiOjE3NzM4ODE0MTIsImFjY291bnRFeHBpcmVkIjpmYWxzZSwiYWNjb3VudEV4cGlyZXNBdCI6MTc3Mzg4MTQxMn0.pWBHcolaeZXd-5DAkMobbJn5DbFoSTDEWYuQn0LC5U4"
}, {
    id: "sonymax",
    name: "Sony Max",
    type: "m3u8",
    logo: "https://i.imgur.com/bj30yKX.jpeg",
    src: "https://satoshi-cors.herokuapp.com/http://103.99.249.139/sonymax/tracks-v1a1/mono.m3u8"
}, {
    id: "hbo",
    name: "Hbo",
    type: "m3u8",
    logo: "https://i.imgur.com/FY3WDtP.jpeg",
    src: "https://cdn-content-cf2-us.latamlive.net/HBO_HD_AR_ENC_LIVE/video.m3u8"
}, {
    id: "hgtv",
    name: "Hgtv",
    type: "mpd",
    drm: "clearkey",
    keyId: "143c537a533b4e53a7137703bc92c0f2",
    key: "551cc5be6820a5b44d099dc7ace177f0",
    logo: "https://i.imgur.com/JiiceUu.jpeg",
    src: "https://sghost.mobileads.uno/uni5/uni5.mpd?id=HGTV"
}, {
    id: "tvnmovieshd",
    name: "Tvn Movies",
    type: "mpd",
    drm: "clearkey",
    keyId: "52480b6651c243e2b48b04ab3ecf05ec",
    key: "aa3513df0bc2d949ee44c52204665d50",
    logo: "https://i.imgur.com/i06xgz9.png",
    src: "https://sghost.mobileads.uno/uni5/uni5.mpd?id=tVnM"
}, {
    id: "celestialmovies",
    name: "Celestial Movies",
    type: "mpd",
    drm: "clearkey",
    keyId: "107e13b213a94a6cbb6d02c25653c083",
    key: "044af5b9e0258e2d39437ee03365fd2d",
    logo: "https://i.imgur.com/GTIL6dh.jpeg",
    src: "https://sghost.mobileads.uno/uni5/uni5.mpd?id=Celestial"
}, {
    id: "celestialclassicmovies",
    name: "Celestial Classic Movies",
    type: "mpd",
    drm: "clearkey",
    keyId: "5dcc7b00add745619ff1dd29ac7e591c",
    key: "cdab9ac07955a7a2ea78b03343b77fbd",
    logo: "https://i.imgur.com/Lhw47f7.jpeg",
    src: "https://sghost.mobileads.uno/uni5/uni5.mpd?id=CelestialC"
}, {
    id: "asianfoodnetwork",
    name: "Asian Food Network",
    type: "mpd",
    drm: "clearkey",
    keyId: "d6f69611e9e94a1cba591f855b191362",
    key: "bbd319d36c1728a8e4cc6bb4a8ad12f4",
    logo: "https://i.imgur.com/xxOtGKI.jpeg",
    src: "https://sghost.mobileads.uno/uni5/uni5.mpd?id=AsianFoodNetwork"
}, {
    id: "net25",
    name: "Net25",
    type: "mpd",
    logo: "https://i.imgur.com/23hbSGd.png",
    src: "https://www.maruyatvph.com/live/net25.mpd"
}, {
    id: "untv",
    name: "Untv",
    type: "mpd",
    logo: "https://i.imgur.com/ML3JTCI.png",
    src: "https://kalibonco.qzz.io/001/2/ch00000090990000001091/manifest.mpd?AuthInfo=v87HD9rEhwHiAdYyrP20TsXah2%2FZLFNNIdWrVrXDMAp8EKxpteUJNLDuI18c3YYNsyK4TH4mOENKJ45mwOyS0g%3D%3D&version=v1.0&BreakPoint=0&virtualDomain=001.live_hls.zte.com&programid=ch00000000000000001177&contentid=ch00000000000000001177&videoid=ch00000090990000001091&recommendtype=0&userid=1919529437122&boid=001&stbid=02%3A00%3A00%3A00%3A00%3A00&terminalflag=1&profilecode=&usersessionid=0IIXG199OEXXXX&NeedJITP=1&JITPMediaType=DASH&JITPDRMType=NO"
}, {
    id: "dzrhtv",
    name: "Dzrh Tv",
    type: "mpd",
    logo: "https://i.imgur.com/5tshNjy.png",
    src: "https://www.maruyatvph.com/live/dzrhtv.mpd"
}, {
    id: "smni",
    name: "Smni",
    type: "mpd",
    logo: "https://i.imgur.com/UE5KwKe.png",
    src: "https://www.maruyatvph.com/live/smnichannel.mpd"
}, {
    id: "solarflix",
    name: "Solarflix",
    type: "mpd",
    logo: "https://i.imgur.com/vafPecU.png",
    src: "https://www.maruyatvph.com/live/solarflix.mpd"
}, {
    id: "one-ph",
    name: "One Ph",
    type: "mpd",
    drm: "clearkey",
    keyId: "b1c7e9d24f8a4d6c9e337a2f1c5b8d60",
    key: "8ff2e524cc1e028f2a4d4925e860c796",
    logo: "https://i.imgur.com/NSvivIm.png",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/oneph_sd/default/index.mpd"
}, {
    id: "one-news",
    name: "One News",
    type: "mpd",
    drm: "clearkey",
    keyId: "2e6a9d7c1f4b4c8a8d33c7b1f0a5e924",
    key: "4c71e178d090332fbfe72e023b59f6d2",
    logo: "https://i.imgur.com/U5OCKh8.png",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/onenews_hd1/default/index.mpd"
}, {
    id: "sari-sari",
    name: "Sari Sari",
    type: "mpd",
    drm: "clearkey",
    keyId: "0a7ab3612f434335aa6e895016d8cd2d",
    key: "b21654621230ae21714a5cab52daeb9d",
    logo: "https://i.imgur.com/upWnLA0.png",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_sarisari/default/index.mpd"
}, {
    id: "buko",
    name: "Buko",
    type: "mpd",
    drm: "clearkey",
    keyId: "d273c085f2ab4a248e7bfc375229007d",
    key: "7932354c3a84f7fc1b80efa6bcea0615",
    logo: "https://i.imgur.com/kdHSPT3.jpeg",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/cg_buko_sd/default/index.mpd"
}, {
    id: "true-tv",
    name: "True Tv",
    type: "mpd",
    drm: "clearkey",
    keyId: "a4e2b9d61c754f3a8d109b6c2f1e7a55",
    key: "1d8d975f0bc2ed90eda138bd31f173f4",
    logo: "https://i.imgur.com/AHJp9KM.png",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/truefm_tv/default/index.mpd"
}, {
    id: "pba-rush",
    name: "Pba Rush",
    type: "mpd",
    drm: "clearkey",
    keyId: "d7f1a9c36b2e4f8d9a441c5e7b2d8f60",
    key: "fb83c86f600ab945e7e9afed8376eb1e",
    logo: "https://i.imgur.com/teHrqAN.jpeg",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_pbarush_hd1/default/index.mpd"
}, {
    id: "one-sports-plus",
    name: "One Sports Plus",
    type: "mpd",
    drm: "clearkey",
    keyId: "f00bd0122a8a4da1a49ea6c49f7098ad",
    key: "a4079f3667ba4c2bcfdeb13e45a6e9c6",
    logo: "https://i.imgur.com/vKqZAte.png",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_onesportsplus_hd1/default/index.mpd"
}, {
    id: "one-sports-hd",
    name: "One Sports Hd",
    type: "mpd",
    drm: "clearkey",
    keyId: "53c3bf2eba574f639aa21f2d4409ff11",
    key: "3de28411cf08a64ea935b9578f6d0edd",
    logo: "https://i.imgur.com/CzHITOm.png",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_onesports_hd/default/index.mpd"
}, {
    id: "uaap-ch",
    name: "Uaap Ch.",
    type: "mpd",
    drm: "clearkey",
    keyId: "95588338ee37423e99358a6d431324b9",
    key: "6e0f50a12f36599a55073868f814e81e",
    logo: "https://i.imgur.com/qoQhGsX.png",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_uaap_cplay_sd/default/index.mpd"
}, {
    id: "nba-ph",
    name: "Nba Ph",
    type: "mpd",
    drm: "clearkey",
    keyId: "d1f8a0c97b3d4e529a6f2c4b8d7e1f90",
    key: "58ab331d14b66bf31aca4284e0a3e536",
    logo: "https://i.imgur.com/IRv3tSI.png",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cgnl_nba/default/index.mpd"
}, {
    id: "cinemaone-global",
    name: "Cinemaone Global",
    type: "mpd",
    logo: "https://i.imgur.com/0EYKkIZ.jpeg",
    src: "https://d9rpesrrg1bdi.cloudfront.net/out/v1/93b9db7b231d45f28f64f29b86dc6c65/index.mpd"
}, {
    id: "cinemo-global",
    name: "Cinemo Global",
    type: "m3u8",
    logo: "https://i.imgur.com/LLMx6Um.png",
    src: "https://d1bail49udbz1k.cloudfront.net/out/v1/78e282e04f0944f3ad0aa1db7a1be645/index_3.m3u8"
}, {
    id: "pbo",
    name: "Pbo",
    type: "mpd",
    logo: "https://i.imgur.com/hh2EP86.png",
    src: "https://maruyatvph.com/kanberds/pbo.mpd"
}, {
    id: "iheartmovies",
    name: "I Heart Movies",
    type: "m3u8",
    logo: "https://i.imgur.com/PyvCh4E.jpeg",
    src: "https://hls.nathcreqtives.com/playlist.m3u8?id=2&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJNb29uIiwiaWF0IjoxNzcyNTg1NDEyLCJleHAiOjE3NzM4ODE0MTIsImFjY291bnRFeHBpcmVkIjpmYWxzZSwiYWNjb3VudEV4cGlyZXNBdCI6MTc3Mzg4MTQxMn0.pWBHcolaeZXd-5DAkMobbJn5DbFoSTDEWYuQn0LC5U4"
}, {
    id: "iheartofasia",
    name: "I Heart Of Asia",
    type: "m3u8",
    logo: "https://i.imgur.com/rIQDZ71.png",
    src: "https://hls.nathcreqtives.com/playlist.m3u8?id=1&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJNb29uIiwiaWF0IjoxNzcyNTg1NDEyLCJleHAiOjE3NzM4ODE0MTIsImFjY291bnRFeHBpcmVkIjpmYWxzZSwiYWNjb3VudEV4cGlyZXNBdCI6MTc3Mzg4MTQxMn0.pWBHcolaeZXd-5DAkMobbJn5DbFoSTDEWYuQn0LC5U4"
}, {
    id: "vivacinema",
    name: "Viva Cinema",
    type: "mpd",
    logo: "https://i.imgur.com/zb85UdW.jpeg",
    src: "https://maruyatvph.com/kanberds/vivacinema.mpd"
}, {
    id: "dzmm-teleradyo",
    name: "Dzmm Teleradyo",
    type: "mpd",
    drm: "clearkey",
    keyId: "47c093e0c9fd4f80839a0337da3dd876",
    key: "603248b858276f533a13e17f2f48c711",
    logo: "https://i.imgur.com/a7arJmp.jpeg",
    src: "https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg01006-abs-cbn-teleradyo-dash-abscbnono/48fc2f9d-055e-4c0c-adab-a81b6956a20b/index.mpd"
}, {
    id: "ptv",
    name: "Ptv",
    type: "mpd",
    drm: "clearkey",
    keyId: "71a130a851b9484bb47141c8966fb4a3",
    key: "ad1f003b4f0b31b75ea4593844435600",
    logo: "https://i.imgur.com/JJFpd7L.png",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/cg_ptv4_sd/default/index.mpd"
}, {
    id: "ibc13",
    name: "Ibc !3",
    type: "mpd",
    logo: "https://i.imgur.com/HVijtWY.jpeg",
    src: "https://kalibonco.qzz.io/001/2/ch00000090990000001089/manifest.mpd?AuthInfo=v87HD9rEhwHiAdYyrP20TsXah2%2FZLFNNIdWrVrXDMAo0mldwqx%2BTfpKT3KIgGit9syK4TH4mOENKJ45mwOyS0g%3D%3D&version=v1.0&BreakPoint=0&virtualDomain=001.live_hls.zte.com&programid=ch00000000000000001216&contentid=ch00000000000000001216&videoid=ch00000090990000001089&recommendtype=0&userid=1773865046699&boid=001&stbid=02%3A00%3A00%3A00%3A00%3A00&terminalflag=1&profilecode=&usersessionid=HCPD4Q2RTHUXXX&NeedJITP=1&JITPMediaType=DASH&JITPDRMType=NO"
}, {
    id: "anc-global",
    name: "Anc Global",
    type: "mpd",
    logo: "https://i.imgur.com/ut8Ovi0.png",
    src: "https://d3cjss68xc4sia.cloudfront.net/out/v1/89ea8db23cb24a91bfa5d0795f8d759e/index.mpd"
}, {
    id: "tfc-asia",
    name: "Tfc Asia",
    type: "mpd",
    logo: "https://i.imgur.com/MHeHxam.png",
    src: "https://d1facupi3cod3q.cloudfront.net/out/v1/e3633f8591e248b0af1af15a474bfa4a/index.mpd"
}, {
    id: "solarsports",
    name: "Solar Sports",
    type: "mpd",
    logo: "https://i.imgur.com/yBFuOAZ.png",
    src: "https://www.maruyatvph.com/live/solarsports.mpd"
}, {
    id: "thrill",
    name: "Thrill",
    type: "mpd",
    logo: "https://i.imgur.com/57N0G9i.jpeg",
    src: "https://kalibonco.qzz.io/001/2/ch00000090990000001253/manifest.mpd?AuthInfo=v87HD9rEhwHiAdYyrP20TsXah2%2FZLFNNIdWrVrXDMAq7M3KTlp1dzcZcVVxlNmQdsyK4TH4mOENKJ45mwOyS0g%3D%3D&version=v1.0&BreakPoint=0&virtualDomain=001.live_hls.zte.com&programid=ch00000000000000001563&contentid=ch00000000000000001563&videoid=ch00000090990000001253&recommendtype=0&userid=1158498506531&boid=001&stbid=02%3A00%3A00%3A00%3A00%3A00&terminalflag=1&profilecode=&usersessionid=EZ3GLGN6GRKXXX&NeedJITP=1&JITPMediaType=DASH&JITPDRMType=NO"
}, {
    id: "metrochannel",
    name: "Metro Channel",
    type: "mpd",
    logo: "https://i.imgur.com/eFYYbP6.png",
    src: "https://kalibonco.qzz.io/001/2/ch00000090990000001267/manifest.mpd?AuthInfo=v87HD9rEhwHiAdYyrP20TsXah2%2FZLFNNIdWrVrXDMAr4hyjlpFsJWrmHS5nwWoXTsyK4TH4mOENKJ45mwOyS0g%3D%3D&version=v1.0&BreakPoint=0&virtualDomain=001.live_hls.zte.com&programid=ch00000000000000001549&contentid=ch00000000000000001549&videoid=ch00000090990000001267&recommendtype=0&userid=1339539301753&boid=001&stbid=02%3A00%3A00%3A00%3A00%3A00&terminalflag=1&profilecode=&usersessionid=NU1C68YJPUXXXX&NeedJITP=1&JITPMediaType=DASH&JITPDRMType=NO"
}, {
    id: "gma-pinoy-tv",
    name: "Gma Pinoy Tv",
    type: "mpd",
    logo: "https://i.imgur.com/zUhUdDq.png",
    src: "https://amg01006-abs-cbn-abscbn-gma-x7-dash-abscbnono-dzsx9.amagi.tv/index.mpd"
}, {
    id: "a2z",
    name: "A2z",
    type: "mpd",
    logo: "https://i.imgur.com/k9qyM89.jpeg",
    src: "https://kalibonco.qzz.io/001/2/ch00000090990000001087/manifest.mpd?AuthInfo=v87HD9rEhwHiAdYyrP20TsXah2%2FZLFNNIdWrVrXDMAqHRrK8UUahwItHhKpXgPXKsyK4TH4mOENKJ45mwOyS0g%3D%3D&version=v1.0&BreakPoint=0&virtualDomain=001.live_hls.zte.com&programid=ch00000000000000001176&contentid=ch00000000000000001176&videoid=ch00000090990000001087&recommendtype=0&userid=1162684427362&boid=001&stbid=02%3A00%3A00%3A00%3A00%3A00&terminalflag=1&profilecode=&usersessionid=8JVNIKBBFCRXXX&NeedJITP=1&JITPMediaType=DASH&JITPDRMType=NO"
}, {
    id: "themanilatimes",
    name: "The Manila Times",
    type: "m3u8",
    logo: "https://i.imgur.com/fhSGEiH.png",
    src: "https://customer-ksrwu2hvu2ipx2fb.cloudflarestream.com/121fd4c01c7ed1c0b1d2c6699e52309a/manifest/video.m3u8?parentOrigin=https%3A%2F%2Fwww.manilatimes.net"
}, {
    id: "kix",
    name: "Kix",
    type: "mpd",
    logo: "https://i.imgur.com/Lx2IUjx.png",
    src: "https://cdn10jtedge.indihometv.com/atm/DASH/kix/manifest.mpd"
}, {
    id: "abante-tv",
    name: "Abante Tv",
    type: "m3u8",
    logo: "https://i.imgur.com/jCE7luW.png",
    src: "https://amg19223-amg19223c12-amgplt0352.playout.now3.amagi.tv/playlist/amg19223-amg19223c12-amgplt0352/playlist.m3u8"
}, {
    id: "bilyonaryo",
    name: "Bilyonaryo",
    type: "m3u8",
    logo: "https://i.imgur.com/W00t4Qn.png",
    src: "https://amg19223-amg19223c11-amgplt0352.playout.now3.amagi.tv/playlist/amg19223-amg19223c11-amgplt0352/playlist.m3u8"
}, {
    id: "aliw23",
    name: "Aliw 23",
    type: "mpd",
    logo: "https://i.imgur.com/xtisCyx.png",
    src: "https://kalibonco.qzz.io/001/2/ch00000090990000001109/manifest.mpd?AuthInfo=v87HD9rEhwHiAdYyrP20TsXah2%2FZLFNNIdWrVrXDMAp%2BWYKp0pXQLOnfpLMLHi2tsyK4TH4mOENKJ45mwOyS0g%3D%3D&version=v1.0&BreakPoint=0&virtualDomain=001.live_hls.zte.com&programid=ch00000000000000001234&contentid=ch00000000000000001234&videoid=ch00000090990000001109&recommendtype=0&userid=1860238582120&boid=001&stbid=02%3A00%3A00%3A00%3A00%3A00&terminalflag=1&profilecode=&usersessionid=6WO7AWCG0YYXXX&NeedJITP=1&JITPMediaType=DASH&JITPDRMType=NO"
}, {
    id: "gnn",
    name: "Gnn",
    type: "mpd",
    logo: "https://i.imgur.com/lnuTk9Y.png",
    src: "https://maruyatvph.com/kanberds/gnn.mpd"
}, {
    id: "lighttv",
    name: "Light Tv",
    type: "mpd",
    logo: "https://i.imgur.com/LXj1WF2.png",
    src: "https://kalibonco.qzz.io/001/2/ch00000090990000001103/manifest.mpd?AuthInfo=v87HD9rEhwHiAdYyrP20TsXah2%2FZLFNNIdWrVrXDMAqkZ6SnNx3gh97OtxQ2ygibsyK4TH4mOENKJ45mwOyS0g%3D%3D&version=v1.0&BreakPoint=0&virtualDomain=001.live_hls.zte.com&programid=ch00000000000000001179&contentid=ch00000000000000001179&videoid=ch00000090990000001103&recommendtype=0&userid=1240130586471&boid=001&stbid=02%3A00%3A00%3A00%3A00%3A00&terminalflag=1&profilecode=&usersessionid=FTDK8F0A60AXXX&NeedJITP=1&JITPMediaType=DASH&JITPDRMType=NO"
}, {
    id: "tmc",
    name: "Tmc",
    type: "mpd",
    logo: "https://i.imgur.com/Lia28EV.jpeg",
    src: "https://kalibonco.qzz.io/001/2/ch00000090990000001080/manifest.mpd?AuthInfo=v87HD9rEhwHiAdYyrP20TsXah2%2FZLFNNIdWrVrXDMArHx%2Fyl86rMkFVqtHp1NtQIsyK4TH4mOENKJ45mwOyS0g%3D%3D&version=v1.0&BreakPoint=0&virtualDomain=001.live_hls.zte.com&programid=ch00000000000000001153&contentid=ch00000000000000001153&videoid=ch00000090990000001080&recommendtype=0&userid=1388444659651&boid=001&stbid=02%3A00%3A00%3A00%3A00%3A00&terminalflag=1&profilecode=&usersessionid=VT2SEXWH4EOXXX&NeedJITP=1&JITPMediaType=DASH&JITPDRMType=NO"
}, {
    id: "cltv36",
    name: "Cltv 36",
    type: "mpd",
    logo: "https://i.imgur.com/BDDKNrP.png",
    src: "https://kalibonco.qzz.io/001/2/ch00000090990000001314/manifest.mpd?AuthInfo=v87HD9rEhwHiAdYyrP20TsXah2%2FZLFNNIdWrVrXDMAp7Iya5QVRTA1RELFN4tQIJ2%2FjHNuou2Jtxin49X3LQKw%3D%3D&version=v1.0&BreakPoint=0&virtualDomain=001.live_hls.zte.com&programid=ch00000000000000001814&contentid=ch00000000000000001814&videoid=ch00000090990000001314&recommendtype=0&userid=1662150007478&boid=001&stbid=02%3A00%3A00%3A00%3A00%3A00&terminalflag=1&profilecode=&usersessionid=UAIG9NVEJ1AXXX&NeedJITP=1&JITPMediaType=DASH&JITPDRMType=NO"
}, {
    id: "k+",
    name: "K+",
    type: "mpd",
    drm: "clearkey",
    keyId: "826e7fd2d6a14060bfea9347d96f8824",
    key: "176897afb079e0cc76bc912df4cb0b6e",
    logo: "https://i.imgur.com/SKZjstD.jpeg",
    src: "https://sghost.mobileads.uno/uni5/uni5.mpd?id=Kplus"
}, {
    id: "axn",
    name: "Axn",
    type: "mpd",
    drm: "clearkey",
    keyId: "4345340d92d64788bef7d99594cbe643",
    key: "c67f6e21ebbd520e31d4141b771d3867",
    logo: "https://i.imgur.com/33lzUIn.png",
    src: "https://sghost.mobileads.uno/uni5/uni5.mpd?id=AXN"
}, {
    id: "celestialmoviespinoy",
    name: "Celestial Movies Pinoy",
    type: "mpd",
    logo: "https://i.imgur.com/LIFCEyr.jpeg",
    src: "https://kalibonco.qzz.io/001/2/ch00000090990000001077/manifest.mpd?AuthInfo=v87HD9rEhwHiAdYyrP20TsXah2%2FZLFNNIdWrVrXDMArHUpvQtyXgWxpVCozt4hcgsyK4TH4mOENKJ45mwOyS0g%3D%3D&version=v1.0&BreakPoint=0&virtualDomain=001.live_hls.zte.com&programid=ch00000000000000001136&contentid=ch00000000000000001136&videoid=ch00000090990000001077&recommendtype=0&userid=1058297419636&boid=001&stbid=02%3A00%3A00%3A00%3A00%3A00&terminalflag=1&profilecode=&usersessionid=B8CE333QUH6XXX&NeedJITP=1&JITPMediaType=DASH&JITPDRMType=NO"
}, {
    id: "tvmaria",
    name: "Tv Maria",
    type: "mpd",
    logo: "https://i.imgur.com/tH1J8L6.jpeg",
    src: "https://kalibonco.qzz.io/001/2/ch00000090990000001160/manifest.mpd?AuthInfo=v87HD9rEhwHiAdYyrP20TsXah2%2FZLFNNIdWrVrXDMAqJiJmfV%2B93mjmGGmqynSohsyK4TH4mOENKJ45mwOyS0g%3D%3D&version=v1.0&BreakPoint=0&virtualDomain=001.live_hls.zte.com&programid=ch00000000000000001374&contentid=ch00000000000000001374&videoid=ch00000090990000001160&recommendtype=0&userid=1568600988255&boid=001&stbid=02%3A00%3A00%3A00%3A00%3A00&terminalflag=1&profilecode=&usersessionid=YLGYZZY14KAXXX&NeedJITP=1&JITPMediaType=DASH&JITPDRMType=NO"
}, {
    id: "kronehit",
    name: "Kronehit",
    type: "m3u8",
    logo: "https://i.imgur.com/2dWV3hO.png",
    src: "https://bitcdn-kronehit.bitmovin.com/v2/hls/chunklist_b3128000.m3u8"
}, {
    id: "cbnnews",
    name: "Cbn News",
    type: "m3u8",
    logo: "https://i.imgur.com/2MGMbPe.jpeg",
    src: "https://1a-1791.com/live/k5e12sb4/slot-74/5gp1-tax8/chunklist_DVR.m3u8"
}, {
    id: "americafirst",
    name: "America First",
    type: "m3u8",
    logo: "https://i.imgur.com/dUCRehp.jpeg",
    src: "https://1a-1791.com/live/v0xi25uh/slot-38/uyre-gh2j_1080p/chunklist_DVR.m3u8"
}, {
    id: "pinoyextreme",
    name: "Pinoy Extreme",
    type: "mpd",
    logo: "https://i.imgur.com/vTTELsg.jpeg",
    src: "https://kalibonco.qzz.io/001/2/ch00000090990000001098/manifest.mpd?AuthInfo=v87HD9rEhwHiAdYyrP20TsXah2%2FZLFNNIdWrVrXDMApC219uqwL0dVmslrkAjamFsyK4TH4mOENKJ45mwOyS0g%3D%3D&version=v1.0&BreakPoint=0&virtualDomain=001.live_hls.zte.com&programid=ch00000000000000001222&contentid=ch00000000000000001222&videoid=ch00000090990000001098&recommendtype=0&userid=1869817604648&boid=001&stbid=02%3A00%3A00%3A00%3A00%3A00&terminalflag=1&profilecode=&usersessionid=NKXBKKPYOEXXXX&NeedJITP=1&JITPMediaType=DASH&JITPDRMType=NO"
}, {
    id: "cna",
    name: "Cna",
    type: "m3u8",
    logo: "https://i.imgur.com/YQtJtLl.jpeg",
    src: "https://d2e1asnsl7br7b.cloudfront.net/7782e205e72f43aeb4a48ec97f66ebbe/index_3.m3u8"
}, {
    id: "mindanownetwork",
    name: "Mindanow Network",
    type: "m3u8",
    logo: "https://i.imgur.com/1PSyVWu.png",
    src: "https://streams.comclark.com/overlay/mindanow/chunks.m3u8"
}, {
    id: "nhkworldjapan",
    name: "Nhk World Japan",
    type: "m3u8",
    logo: "https://i.imgur.com/6bLJio9.png",
    src: "https://masterpl.hls.nhkworld.jp/hls/w/live/smarttv.m3u8"
}, {
    id: "rockentertainment",
    name: "Rock Entertainment",
    type: "mpd",
    drm: "clearkey",
    keyId: "a8b2d6f14c9e4d7a8f552c1e9b7d6a30",
    key: "b61a33a4281e7c8e68b24b9af466f7b4",
    logo: "https://i.imgur.com/SImGxIZ.jpeg",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_rockentertainment/default/index.mpd"
}, {
    id: "rockaction",
    name: "Rock Action",
    type: "mpd",
    drm: "clearkey",
    keyId: "8d2a6f1c9b7e4c3da5f01e7b9c6d2f44",
    key: "23841651ebf49fa03fdfcd7b43337f87",
    logo: "https://i.imgur.com/84or2XE.jpeg",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_rockextreme/default/index.mpd"
}, {
    id: "ocn-1",
    name: "Ocn 1",
    type: "mpd",
    drm: "clearkey",
    keyId: "817839de27764deb879c65c571c19226",
    key: "2b1443f33c919c89429a21259974a224",
    logo: "https://i.imgur.com/dQRCCCd.png",
    src: "https://ocnmovies-drm2-mcdn.tving.com/ocnmovies_drm/live5000.smil/manifest.mpd"
}, {
    id: "ocn-2",
    name: "Ocn 2",
    type: "mpd",
    drm: "clearkey",
    keyId: "a97de619e5834e6da10c9bab768fc626",
    key: "1452d46b8ecd87b38310ce90d4f5209f",
    logo: "https://i.imgur.com/dQRCCCd.png",
    src: "https://ocnmovies2-drm2-mcdn.tving.com/ocnmovies2_drm/live5000.smil/manifest.mpd"
}, {
    id: "hits-movies",
    name: "Hits Movies",
    type: "mpd",
    drm: "clearkey",
    keyId: "f56b57b32d7e4b2cb21748c0b56761a7",
    key: "3df06a89aa01b32655a77d93e09e266f",
    logo: "https://i.imgur.com/FEHwzDt.jpeg",
    src: "https://qp-pldt-live-grp-12-prod.akamaized.net/out/u/dr_hitsmovies.mpd"
}, {
    id: "tapmovies",
    name: "Tap Movies",
    type: "mpd",
    drm: "clearkey",
    keyId: "71cbdf02b595468bb77398222e1ade09",
    key: "c3f2aa420b8908ab8761571c01899460",
    logo: "https://i.imgur.com/RkGWNrS.png",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_tapmovies_hd1/default/index.mpd"
}, {
    id: "taptv",
    name: "Tap Tv",
    type: "mpd",
    logo: "https://i.imgur.com/I1abp6U.jpeg",
    src: "https://kalibonco.qzz.io/001/2/ch00000090990000001149/manifest.mpd?AuthInfo=v87HD9rEhwHiAdYyrP20TsXah2%2FZLFNNIdWrVrXDMAroVo9XMLpd0k2y9rVerSvmsyK4TH4mOENKJ45mwOyS0g%3D%3D&version=v1.0&BreakPoint=0&virtualDomain=001.live_hls.zte.com&programid=ch00000000000000001319&contentid=ch00000000000000001319&videoid=ch00000090990000001149&recommendtype=0&userid=1130216695762&boid=001&stbid=02%3A00%3A00%3A00%3A00%3A00&terminalflag=1&profilecode=&usersessionid=OXNJGU1PKJQXXX&NeedJITP=1&JITPMediaType=DASH&JITPDRMType=NO"
}, {
    id: "tapedge",
    name: "Tap Edge",
    type: "mpd",
    logo: "https://i.imgur.com/K80zmfd.jpeg",
    src: "https://kalibonco.qzz.io/001/2/ch00000090990000001150/manifest.mpd?AuthInfo=v87HD9rEhwHiAdYyrP20TsXah2%2FZLFNNIdWrVrXDMAq%2B2uVbDOBwGF5t4YHKR5dbsyK4TH4mOENKJ45mwOyS0g%3D%3D&version=v1.0&BreakPoint=0&virtualDomain=001.live_hls.zte.com&programid=ch00000000000000001320&contentid=ch00000000000000001320&videoid=ch00000090990000001150&recommendtype=0&userid=1226123292884&boid=001&stbid=02%3A00%3A00%3A00%3A00%3A00&terminalflag=1&profilecode=&usersessionid=DO0EYWTCAYKXXX&NeedJITP=1&JITPMediaType=DASH&JITPDRMType=NO"
}, {
    id: "tapactionflix",
    name: "Tap Action Flix",
    type: "mpd",
    logo: "https://i.imgur.com/8AknaDC.jpeg",
    src: "https://kalibonco.qzz.io/001/2/ch00000090990000001305/manifest.mpd?AuthInfo=v87HD9rEhwHiAdYyrP20TsXah2%2FZLFNNIdWrVrXDMApahcUJJEYAxPtEef94INw12%2FjHNuou2Jtxin49X3LQKw%3D%3D&version=v1.0&BreakPoint=0&virtualDomain=001.live_hls.zte.com&programid=ch00000000000000001775&contentid=ch00000000000000001775&videoid=ch00000090990000001305&recommendtype=0&userid=1992031084771&boid=001&stbid=02%3A00%3A00%3A00%3A00%3A00&terminalflag=1&profilecode=&usersessionid=HTEZZPU574PXXX&NeedJITP=1&JITPMediaType=DASH&JITPDRMType=NO"
}, {
    id: "tapsports",
    name: "Tap Sports",
    type: "mpd",
    drm: "clearkey",
    keyId: "5e7c1b9a2d8f4a6c9f30b1d6e2a8c744",
    key: "6178d9d177689eec5028e2dd608ae7b6",
    logo: "https://i.imgur.com/Z1bwGTt.png",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_tapsports/default/index.mpd"
}, {
    id: "xplore",
    name: "Xplore",
    type: "mpd",
    drm: "clearkey",
    keyId: "6aab8f40536f4ea98e7c97b8f3aa7d4e",
    key: "139aa5a55ade471faaddacc4f4de8807",
    logo: "https://i.imgur.com/MVQiE2I.jpeg",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/cg_mptv/default/index.mpd"
}, {
    id: "dreamworks",
    name: "Dreamworks",
    type: "mpd",
    drm: "clearkey",
    keyId: "7b1e9c4d5a2f4d8c9f106d3a8b2c1e77",
    key: "8b2904224c6cee13d2d4e06c0a3b2887",
    logo: "https://i.imgur.com/F1UZ2KX.png",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_dreamworks_hd1/default/index.mpd"
}, {
    id: "nickoledeon",
    name: "Nickoledeon",
    type: "mpd",
    drm: "clearkey",
    keyId: "9b10e787fac84ff484c8c7d7f7668925",
    key: "7d7d3793e4489f6ebc50d002e4bdbd44",
    logo: "https://i.imgur.com/U2rGTrC.jpeg",
    src: "https://sghost.mobileads.uno/uni5/uni5.mpd?id=Nickelodeon"
}, {
    id: "moonbugkids",
    name: "Moon Bug Kids",
    type: "mpd",
    drm: "clearkey",
    keyId: "c3189457b38b4ed9888c5a2e763f0ab8",
    key: "d4dc62e11dd1856ed4f9a26d44271d0b",
    logo: "https://i.imgur.com/0O0tFOd.png",
    src: "https://sghost.mobileads.uno/uni5/uni5.mpd?id=Moonbug"
}, {
    id: "myx",
    name: "Myx",
    type: "mpd",
    logo: "https://i.imgur.com/ro6SAsn.png",
    src: "https://d24xfhmhdb6r0q.cloudfront.net/out/v1/e897a7b6414a46019818ee9f2c081c4f/index.mpd"
}, {
    id: "outerspheretv",
    name: "Outer Sphere Tv",
    type: "m3u8",
    logo: "https://i.imgur.com/SyYAApZ.png",
    src: "https://us7.usaportal.workers.dev/https://raw.githubusercontent.com/mystery75/m3u8/main/OUTERSPHERE.m3u8"
}, {
    id: "moviesphere",
    name: "Movie Sphere",
    type: "m3u8",
    logo: "https://i.imgur.com/2tt9RJ8.png",
    src: "https://moviesphereuk-samsunguk.amagi.tv/480p-vtt/index.m3u8"
}, {
    id: "biliardtv",
    name: "Biliard Tv",
    type: "m3u8",
    logo: "https://i.imgur.com/VmCYz0N.jpeg",
    src: "https://1b29dd71cd5e4191a3eb26afff631ed3.mediatailor.us-west-2.amazonaws.com/v1/manifest/9d062541f2ff39b5c0f48b743c6411d25f62fc25/SportsTribal-BilliardTV/14c93ae8-85e0-489d-b7cf-4cc25c014dcf/4.m3u8"
}, {
    id: "hbo",
    name: "Hbo",
    type: "mpd",
    logo: "https://i.imgur.com/gFz7eZB.jpeg",
    src: "https://maruyatvph.com/kanberds/hbo.mpd"
}, {
    id: "cinemax",
    name: "Cinemax",
    type: "mpd",
    logo: "https://i.imgur.com/afBXFQg.jpeg",
    src: "https://kalibonco.qzz.io/001/2/ch00000090990000001108/manifest.mpd?AuthInfo=v87HD9rEhwHiAdYyrP20TsXah2%2FZLFNNIdWrVrXDMAoD7Jkv0l3sE1jz6821dGRWsyK4TH4mOENKJ45mwOyS0g%3D%3D&version=v1.0&BreakPoint=0&virtualDomain=001.live_hls.zte.com&programid=ch00000000000000001233&contentid=ch00000000000000001233&videoid=ch00000090990000001108&recommendtype=0&userid=1499683383370&boid=001&stbid=02%3A00%3A00%3A00%3A00%3A00&terminalflag=1&profilecode=&usersessionid=W0IF3T6I0YAXXX&NeedJITP=1&JITPMediaType=DASH&JITPDRMType=NO"
}, {
    id: "bbc-earth",
    name: "Bbc Earth",
    type: "m3u8",
    logo: "https://i.imgur.com/FMCuIp2.jpeg",
    src: "https://cdn4.skygo.mn/live/disk1/BBC_earth/HLSv3-FTA/BBC_earth.m3u8"
}, {
    id: "bbc-lifestyle",
    name: "Bbc Lifestyle",
    type: "m3u8",
    logo: "https://i.imgur.com/Uf6tD84.jpeg",
    src: "https://cdn4.skygo.mn/live/disk1/BBC_lifestyle/HLSv3-FTA/BBC_lifestyle.m3u8"
}, {
    id: "cartoon-network",
    name: "Cartoon Network",
    type: "m3u8",
    logo: "https://i.imgur.com/oiC63mz.png",
    src: "https://cdn4.skygo.mn/live/disk1/Cartoon_Network/HLSv3-FTA/Cartoon_Network.m3u8"
}, {
    id: "cartoonito",
    name: "Cartoonito",
    type: "m3u8",
    logo: "https://i.imgur.com/eRNja8g.png",
    src: "https://cdn4.skygo.mn/live/disk1/Boomerang/HLSv3-FTA/Boomerang.m3u8"
}, {
    id: "discovery-asia",
    name: "Discovery Asia",
    type: "m3u8",
    logo: "https://i.imgur.com/aLdZSbq.png",
    src: "https://cdn4.skygo.mn/live/disk1/Discovery_Asia/HLSv3-FTA/Discovery_Asia.m3u8"
}, {
    id: "infast",
    name: "Infast",
    type: "m3u8",
    logo: "https://i.imgur.com/uek1b5Z.png",
    src: "https://insighttv-samsung-us.amagi.tv/playlist.m3u8"
}, {
    id: "mmatv",
    name: "Mma Tv",
    type: "m3u8",
    logo: "https://i.imgur.com/vsnGCvf.png",
    src: "https://streams2.sofast.tv/vglive-sk-462904/tracks-v1a1/mono.ts.m3u8?hls_proxy_host=f4eb0d287702d48f6bbf6e6f56891e63"
}, {
    id: "inWonder",
    name: "InWonder",
    type: "m3u8",
    logo: "https://i.imgur.com/jZsYvPM.jpeg",
    src: "https://amg00861-terninternation-inwonder-samsungau-1k63k.amagi.tv/playlist/amg00861-terninternation-inwonder-samsungau/playlist.m3u8"
}, {
    id: "disney-xd",
    name: "Disney Xd",
    type: "m3u8",
    logo: "https://i.imgur.com/Po1NF11.jpeg",
    src: "https://fl1.moveonjoy.com/DISNEY_XD/index.m3u8"
}, {
    id: "z-tv-canada",
    name: "Z Tv Canada",
    type: "m3u8",
    logo: "https://i.imgur.com/EPmdHSd.jpeg",
    src: "https://origin-cae-m462953.toober.com/4c3caf7294b3/c8bf99484885/playlist.m3u8"
}, {
    id: "nbcnewsnow",
    name: "Nbc News Now",
    type: "m3u8",
    logo: "https://i.imgur.com/JZt2qh5.png",
    src: "https://d1bl6tskrpq9ze.cloudfront.net/hls/master.m3u8?ads.xumo_channelId=99984003"
}, {
    id: "w-network",
    name: "W Network",
    type: "m3u8",
    logo: "https://i.imgur.com/t7XdBh8.png",
    src: "https://fl1.moveonjoy.com/W_NETWORK/index.m3u8"
}, {
    id: "starz",
    name: "Starz",
    type: "m3u8",
    logo: "https://i.imgur.com/XFz10IQ.jpeg",
    src: "https://fl41.moveonjoy.com/STARZ/tracks-v1a1/mono.ts.m3u8"
}, {
    id: "starzedge",
    name: "Starz Edge",
    type: "m3u8",
    logo: "https://i.imgur.com/GtzpK60.jpeg",
    src: "https://fl41.moveonjoy.com/STARZ_EDGE/tracks-v1a1/mono.ts.m3u8"
}, {
    id: "starzcomedy",
    name: "Starz Comedy",
    type: "m3u8",
    logo: "https://i.imgur.com/7WfmRVK.png",
    src: "https://fl41.moveonjoy.com/STARZ_COMEDY/tracks-v1a1/mono.ts.m3u8"
}, {
    id: "starzwest",
    name: "Starz West",
    type: "m3u8",
    logo: "https://i.imgur.com/2etffAj.png",
    src: "https://fl31.moveonjoy.com/STARZ_WEST/tracks-v1a1/mono.ts.m3u8"
}, {
    id: "starzencoreaction",
    name: "Starz Encore Action",
    type: "m3u8",
    logo: "https://i.imgur.com/TCWoNOQ.png",
    src: "https://fl31.moveonjoy.com/STARZ_ENCORE_ACTION/tracks-v1a1/mono.ts.m3u8"
}, {
    id: "starzencoreclassic",
    name: "Starz Encore Classic",
    type: "m3u8",
    logo: "https://i.imgur.com/TCWoNOQ.png",
    src: "https://fl31.moveonjoy.com/STARZ_ENCORE_CLASSIC/tracks-v1a1/mono.ts.m3u8"
}, {
    id: "starzencorewestern",
    name: "Starz Encore Western",
    type: "m3u8",
    logo: "https://i.imgur.com/TCWoNOQ.png",
    src: "https://fl31.moveonjoy.com/STARZ_ENCORE_WESTERNS/tracks-v1a1/mono.ts.m3u8"
}, {
    id: "pop",
    name: "Pop",
    type: "m3u8",
    logo: "https://i.imgur.com/fGUlCY3.png",
    src: "https://cdn-uw2-prod.tsv2.amagi.tv/linear/amg01753-narrativeentert-popkids-lggb/playlist.m3u8"
}, {
    id: "knowledge-network",
    name: "Knowledge Network",
    type: "m3u8",
    logo: "https://i.imgur.com/evVjZSo.png",
    src: "https://d1wal6k3d7ssin.cloudfront.net/out/v1/ea91db0906c847a4931b46a9ec36e77b/index.m3u8"
}, {
    id: "arirang",
    name: "Arirang",
    type: "m3u8",
    logo: "https://i.imgur.com/sU2CoTy.jpeg",
    src: "https://cdn4.skygo.mn/live/disk1/Arirang/HLSv3-FTA/Arirang.m3u8"
}, {
    id: "zsine",
    name: "Z Sine",
    type: "m3u8",
    logo: "https://i.imgur.com/yV682aD.jpeg",
    src: "https://amg17931-zee-amg17931c9-samsung-ph-6528.playouts.now.amagi.tv/ts-eu-w1-n2/playlist/amg17931-asiatvusaltdfast-zeesine-samsungph/cb563d1c796c608d84ce3b78d9f462ffa65928d80b6c852a6ab454876da64607d1e3b680fd358b785d9f01de6a1a0a080361cf12ce3407c3c76ad91174204213cfcac9229d86170ab5c60c2c3aab016635837209c0790a79dca93d0d8636ba304530e01b615b37c2ec5da96852db80148b6f4adafb8c2360625f5c98435ee3b24af7f8e20841db3af2ac1c4cc02658e68314c8c94dee80d0469645d320f84295c7a6838115e0ccab4691df3033733a1255dbeb499bc051bfca8a603799625a297437c790e335caa1e43d277debf6cac50997d7408e57e74d36b509944ec647e29442a2c4932cf0fdc1b36f442db6cb1b4c26aeecac8bb15359d937abf2bf8f3214cb87b13897db65896f0b41966a4f15459d2bb6fc48a4a7601c77ed904b9291b3b922d1e745b12ad0cef8943c0d1b2d5442ce6aab9469d43ece3886fa53700c0314f6da62cd888f0a6b2257d0d41794320ba9d78eb4da0c10c374540fbb379708532c841f4448c801b5da306582234aa2303ef0577cc061f4aa23f8a294b4526ffb8e8912b13faf860bd4f710a022690a55fda17a2d302617e7e768093f6ed005b583b886593d40bda783aeba1052611e185d0b87e79d00b886d2261013811e66577d1e139913c52bb8244c1325dd11c3a66b20d7e640f80565933b62062217d0329ae3574408a95254e665/42/1920x1080_6046040/index.m3u8?captcha_token=6cbed918d3ed02cf%3A0af73aa8814d1dd6cea396a9309860"
}, {
    id: "much",
    name: "Much",
    type: "m3u8",
    logo: "https://i.imgur.com/JjYki5V.png",
    src: "https://fl1.moveonjoy.com/MUCH/index.m3u8"
}, {
    id: "mhz",
    name: "Mhz",
    type: "m3u8",
    logo: "https://i.imgur.com/a5fw83n.jpeg",
    src: "https://mhz-samsung-linear-ca.samsung.wurl.tv/playlist.m3u8"
}, {
    id: "one-31",
    name: "One 31",
    type: "m3u8",
    logo: "https://i.imgur.com/T2ZVRZw.jpeg",
    src: "https://bcovlive-a.akamaihd.net/b6603a14ea59440a95e9235e14bc9332/ap-southeast-1/6415628290001/9c3d7fc7d10840a69e48b5939ae886e0/playlist_ssaiM.m3u8"
}, {
    id: "autentic-travel",
    name: "Autentic Travel",
    type: "m3u8",
    logo: "https://i.imgur.com/GlteIO6.png",
    src: "https://cb0c87cc605942ff9766a4e6744bbadc.mediatailor.us-east-1.amazonaws.com/v1/master/44f73ba4d03e9607dcd9bebdcb8494d86964f1d8/RlaxxTV-eu_AutenticTravel/playlist.m3u8"
}, {
    id: "wild-television-network",
    name: "Wild Television Network",
    type: "m3u8",
    logo: "https://i.imgur.com/wbJt1US.png",
    src: "https://dfhsahpa45kk2.cloudfront.net/scheduler/scheduleMaster/476.m3u8"
}, {
    id: "love-nature",
    name: "Love Nature",
    type: "m3u8",
    logo: "https://i.imgur.com/B8ywopB.jpeg",
    src: "https://aegis-cloudfront-1.tubi.video/6d6d0f24-8445-4b4c-bdf6-44f9e38beaa4/playlist.m3u8"
}, {
    id: "mediacorp_en",
    name: "Mediacorp English",
    type: "m3u8",
    logo: "https://i.imgur.com/Qt1xyC8.jpeg",
    src: "https://d35j504z0x2vu2.cloudfront.net/v1/manifest/0bc8e8376bd8417a1b6761138aa41c26c7309312/mediacorp-entertainment-english/85547489-2e92-414c-afe1-8c1ed45698a3/0.m3u8"
}, {
    id: "mediacorp_cn",
    name: "Mediacorp Chinese",
    type: "m3u8",
    logo: "https://i.imgur.com/Qt1xyC8.jpeg",
    src: "https://d35j504z0x2vu2.cloudfront.net/v1/manifest/0bc8e8376bd8417a1b6761138aa41c26c7309312/mediacorp-entertainment-chinese/510cace9-8cc1-40a0-8ffa-31eaa2d3dae4/0.m3u8"
}, {
    id: "mediacorp_ta",
    name: "Mediacorp Tamil",
    type: "m3u8",
    logo: "https://i.imgur.com/Qt1xyC8.jpeg",
    src: "https://d35j504z0x2vu2.cloudfront.net/v1/manifest/0bc8e8376bd8417a1b6761138aa41c26c7309312/mediacorp-entertainment-tamil/d67278a3-321b-4490-8fd6-805f1ffe43f9/0.m3u8"
}, {
    id: "premiersports",
    name: "Premier Sports",
    type: "m3u8",
    logo: "https://i.imgur.com/FwqZXUg.jpeg",
    src: "https://amg19223-amg19223c3-amgplt0351.playout.now3.amagi.tv/ts-eu-w1-n2/playlist/amg19223-amg19223c3-amgplt0351/77dd27f4-06bc-11f1-b2b3-ca290453122f/3/1280x720_3000140/index.m3u8"
}, {
    id: "premiersports2",
    name: "Premier Sports 2",
    type: "m3u8",
    logo: "https://i.imgur.com/lW15PhX.jpeg",
    src: "https://amg19223-amg19223c4-amgplt0351.playout.now3.amagi.tv/ts-eu-w1-n2/playlist/amg19223-amg19223c4-amgplt0351/ed4f4ddf-06bc-11f1-88c1-36d19213437f/193/854x480_1478083/index.m3u8"
}, {
    id: "extrem",
    name: "Extrem Sports",
    type: "m3u8",
    logo: "https://i.imgur.com/S6WRVbP.jpeg",
    src: "https://streams2.sofast.tv/v1/master/611d79b11b77e2f571934fd80ca1413453772ac7/e0b81a5c-6ab5-48cd-aaa9-f82de4ab5bf9/manifest.m3u8"
}, {
    id: "starcinema",
    name: "Star Cinema",
    type: "m3u8",
    logo: "https://i.imgur.com/Auq7Mk9.jpeg",
    src: "https://ssai.aniview.com/api/v1/hls/stream.m3u8?AVS_SSAIID=6743dbc3fb7aa20b270802ff"
}, {
    id: "strawberry",
    name: "Strawberry Shortcake",
    type: "m3u8",
    logo: "https://i.imgur.com/1oEQWvQ.png",
    src: "https://d1si3n1st4nkgb.cloudfront.net/manifest/3fec3e5cac39a52b2132f9c66c83dae043dc17d4/prod_default_samsungtvplus-xumo/96a9d3b0-ee91-4a47-acb4-6c8d19d775c1/5.m3u8"
}, {
    id: "outdoor",
    name: "Outdoor Channel",
    type: "m3u8",
    logo: "https://i.imgur.com/bdoThwg.png",
    src: "https://cdn-apse1-prod.tsv2.amagi.tv/linear/amg00718-outdoorchannela-outdoortvnz-samsungnz/playlist.m3u8"
}, {
    id: "ion",
    name: "ION TV",
    type: "m3u8",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Ion_logo.svg/512px-Ion_logo.svg.png",
    src: "https://fl7.moveonjoy.com/ION_TV/tracks-v1a1/mono.ts.m3u8"
}, {
    id: "ionplus",
    name: "ION Plus",
    type: "m3u8",
    logo: "https://i.imgur.com/1dgCvNE.png",
    src: "https://d34lnyh33n4440.cloudfront.net/playlist/amg01438-ewscrippscompan-ionplus-tablo/175/1920x1080_5058864/index.m3u8"
}, {
    id: "flix",
    name: "&Flix",
    type: "m3u8",
    logo: "https://i.imgur.com/JMeY5wP.jpeg",
    src: "https://edge3-moblive.yuppcdn.net/drm/smil:nflixdrm.smil/chunklist_b996000.m3u8"
}, {
    id: "romanza",
    name: "Romanza+",
    type: "m3u8",
    logo: "https://i.imgur.com/FHOoDcg.jpeg",
    src: "https://livecdn.premiumfree.tv/afxpstr/Romanza/tracks-v2a1/mono.ts.m3u8"
}, {
    id: "rakutenviki",
    name: "Rakuten Viki",
    type: "m3u8",
    logo: "https://i.imgur.com/sRKd4EM.png",
    src: "https://newidco-rakutenviki-2-eu.xiaomi.wurl.tv/4300.m3u8"
}, {
    id: "rakuten1",
    name: "Rakuten TV 1",
    type: "m3u8",
    logo: "https://i.imgur.com/Meew6eX.png",
    src: "https://0145451975a64b35866170fd2e8fa486.mediatailor.eu-west-1.amazonaws.com/v1/manifest/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-5987/4.m3u8"
}, {
    id: "rakuten2",
    name: "Rakuten TV 2",
    type: "m3u8",
    logo: "https://i.imgur.com/Meew6eX.png",
    src: "https://bca5a421a70c46ad911efd0a4767c4bf.mediatailor.eu-west-1.amazonaws.com/v1/manifest/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6075/4.m3u8"
}, {
    id: "asiancrush",
    name: "AsianCrush",
    type: "m3u8",
    logo: "https://i.imgur.com/fUg91vw.jpeg",
    src: "https://0fj.cc/acrush"
}, {
    id: "bravo",
    name: "Bravo",
    type: "m3u8",
    logo: "https://i.imgur.com/JmTIRLF.png",
    src: "https://fl7.moveonjoy.com/BRAVO/tracks-v1a1/mono.ts.m3u8"
}, {
    id: "astroawani",
    name: "Astro Awani",
    type: "m3u8",
    logo: "https://i.imgur.com/Z6oJ0cZ.jpeg",
    src: "https://d2idp3hzkhjpih.cloudfront.net/out/v1/4b85d9c2bf97413eb0c9fd875599b837/index_3.m3u8"
}, {
    id: "blastmovies",
    name: "Blast Movies",
    type: "m3u8",
    logo: "https://i.imgur.com/bVtMFhg.png",
    src: "https://amg19223-amg19223c7-amgplt0351.playout.now3.amagi.tv/playlist/amg19223-amg19223c7-amgplt0351/playlist.m3u8"
}, {
    id: "hbo",
    name: "HBO",
    type: "m3u8",
    logo: "https://i.imgur.com/gFz7eZB.jpeg",
    src: "https://fl1.moveonjoy.com/HBO/index.m3u8"
}, {
    id: "france24",
    name: "France 24",
    type: "m3u8",
    logo: "https://i.imgur.com/KH0RSwP.jpeg",
    src: "https://live.france24.com/hls/live/2037218-b/F24_EN_HI_HLS/master_5000.m3u8"
}, {
    id: "bbcnews",
    name: "BBC News",
    type: "m3u8",
    logo: "https://i.imgur.com/WVvPdlk.png",
    src: "https://cdn4.skygo.mn/live/disk1/BBC_News/HLSv3-FTA/BBC_News.m3u8"
}, {
    id: "aljazeera",
    name: "Al Jazeera",
    type: "m3u8",
    logo: "https://i.imgur.com/uiP9aHD.png",
    src: "https://d1cy85syyhvqz5.cloudfront.net/v1/master/7b67fbda7ab859400a821e9aa0deda20ab7ca3d2/aljazeeraLive/AJE/index.m3u8"
}, {
    id: "dw",
    name: "Dw",
    type: "m3u8",
    logo: "https://i.imgur.com/frpxwxF.png",
    src: "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/stream05/streamPlaylist.m3u8"
}, {
    id: "trt_world",
    name: "Trt World",
    type: "m3u8",
    logo: "https://i.imgur.com/ArFYAL1.png",
    src: "https://tv-trtworld.medya.trt.com.tr/master_1080.m3u8"
}, {
    id: "euronews",
    name: "Euro News",
    type: "m3u8",
    logo: "https://i.imgur.com/5UG3eNS.jpeg",
    src: "https://d35j504z0x2vu2.cloudfront.net/v1/manifest/0bc8e8376bd8417a1b6761138aa41c26c7309312/euronews/c3f951bf-71cc-40b6-b806-1cf655cae2f2/5.m3u8"
}, {
    id: "dubai_one",
    name: "Dubai One",
    type: "m3u8",
    logo: "https://i.imgur.com/bMzu8UH.jpeg",
    src: "https://dminnvllta.cdn.mgmlcdn.com/dubaione/smil:dubaione.stream.smil/chunklist_b1300000.m3u8"
}, {
    id: "lotus_macau",
    name: "Lotus Macau",
    type: "m3u8",
    logo: "https://i.imgur.com/cQyJqkd.jpeg",
    src: "https://cdn4.skygo.mn/live/disk1/Lotus/HLSv3-FTA/Lotus.m3u8"
}, {
    id: "warner_tv",
    name: "Warner Tv",
    type: "m3u8",
    logo: "https://i.imgur.com/Q4NhDKm.png",
    src: "https://cdn4.skygo.mn/live/disk1/Warner/HLSv3-FTA/Warner-avc1_2089200=7-mp4a_256000_eng=6.m3u8"
}, {
    id: "bollywood_hd",
    name: "Bollywood Hd",
    type: "m3u8",
    logo: "https://i.imgur.com/scDKOLS.png",
    src: "https://d35j504z0x2vu2.cloudfront.net/v1/master/0bc8e8376bd8417a1b6761138aa41c26c7309312/bollywood-hd/manifest.m3u8"
}, {
    id: "bollywood_classic",
    name: "Bollywood Classic",
    type: "m3u8",
    logo: "https://i.imgur.com/ugPo6ca.png",
    src: "https://d35j504z0x2vu2.cloudfront.net/v1/master/0bc8e8376bd8417a1b6761138aa41c26c7309312/bollywood-classic/manifest.m3u8"
}, {
    id: "z_one",
    name: "Z One",
    type: "m3u8",
    logo: "https://i.imgur.com/dEMONnR.jpeg",
    src: "https://amg17931-zee-amg17931c6-samsung-au-8872.playouts.now.amagi.tv/ts-eu-w1-n2/playlist/amg17931-asiatvusaltdfast-zeeworld-samsungau/149/640x360_1222701/index.m3u8"
}, {
    id: "fx_movie",
    name: "Fx Movie",
    type: "m3u8",
    logo: "https://i.imgur.com/DALxKKD.jpeg",
    src: "https://fl61.moveonjoy.com/FX_MOVIE/tracks-v1a1/mono.ts.m3u8"
}, {
    id: "fxx",
    name: "Fxx",
    type: "m3u8",
    logo: "https://i.imgur.com/zys4htx.png",
    src: "https://fl61.moveonjoy.com/FXX/tracks-v1a1/mono.ts.m3u8"
}, {
    id: "abclocalish",
    name: "Abc Localish",
    type: "m3u8",
    logo: "https://i.imgur.com/EBlJYZn.jpeg",
    src: "https://aegis-cloudfront-1.tubi.video/0ecc85a2-5e1b-482a-9c69-3eaaee160f2e/index_3.m3u8"
}, {
    id: "livenowfromfox",
    name: "Live Now From Fox",
    type: "m3u8",
    logo: "https://i.imgur.com/6n868XV.jpeg",
    src: "https://amg00488-foxdigital-livenowbyfox-lgus-y0a81.amagi.tv/ts-us-w2-n2/playlist/amg00488-foxdigital-livenowbyfox-lgus/cb563d1c796c608d84ce3b78d9f462ffa65928d80b6c852a6ab454876da64607d1e3b680fd358b785d9f01de6a1a0a080361cf12ce3407c3c76ad91174204213cfcac9229d86170ab5c60c2c3aab016635837209c0790a79dca93d0d8636ba304530e01b615b37c2ec5da96852db80148b6f4adafb8c2360625f5c98435ee3b24aaafab55c46d06df5ac1c4ec77d58e68314c8c915bcd38146c8168075f416c8c6a3d88746e0ccab4691df3033733a1255dbeb499bc051bfca8a603799625a297437c790e335caa1e43d277debf6cac50997d7408e57e74d36b509944ec647e29442a2c4932cf0fdc1b36f442db6cb1b4c26aeecac8bb15359d937abf2bf8f3214cb87b13897db65896f0b41966a4f15459d2bb6fc48a4a7601c77ed904b9291b3b922d1e745b12ad0cef8943c0d1b2d5442ce6aab9469d43ece3886fa53700c0314f6da62cd888f0a6b2257d0d41794320ba9d78eb4da0c10c374540fbb379708532c841f4448c801b5da306582234aa2303ef0577cc061f4aa23f8a294b4526ffb8e8912b13faf860bd4f710a022690a55fda17a2d302617e7e768093f6ed005b583b886593d40bda783aeba1052611e185d0b87e79d00b886d2261013811e66577d1e139913c52bb8244c1325dd11c3a66a25d156c14c1e59f1f13c81454846ad278fc5485b0932102d780f/140/1280x720_2886400/index.m3u8"
}, {
    id: "film4",
    name: "Film4",
    type: "m3u8",
    logo: "https://i.imgur.com/MTSgoGI.png",
    src: "https://cache1a.netplus.ch/live/eds/film4/browser-HLS8/film4-avc1_2600000=3.m3u8"
}, {
    id: "jungo_pinoy",
    name: "Jungo Pinoy",
    type: "m3u8",
    logo: "https://i.imgur.com/W3gHsJ9.png",
    src: "https://jungotvstream.chanall.tv/jungotv/jungopinoytv/stream.m3u8"
}, {
    id: "kidsflix",
    name: "KidsFlix",
    type: "m3u8",
    logo: "https://i.imgur.com/4Pn0ADQ.png",
    src: "https://stream-us-east-1.getpublica.com/playlist.m3u8?network_id=50"
}, {
    id: "redbox_movies",
    name: "Red Box Movies",
    type: "m3u8",
    logo: "https://i.imgur.com/OrGCnPg.jpg",
    src: "https://7732c5436342497882363a8cd14ceff4.mediatailor.us-east-1.amazonaws.com/v1/master/04fd913bb278d8775298c26fdca9d9841f37601f/Plex_NewMovies/playlist.m3u8"
}, {
    id: "free_movies",
    name: "Free Movies",
    type: "m3u8",
    logo: "https://i.imgur.com/I13yHUH.png",
    src: "https://amg01553-amg01553c2-samsung-ph-7163.playouts.now.amagi.tv/playlist.m3u8"
}, {
    id: "amc_plus",
    name: "Amc+",
    type: "m3u8",
    logo: "https://i.imgur.com/cKyj2ef.png",
    src: "https://bcovlive-a.akamaihd.net/ba853de442c140b7b3dc020001597c0a/us-east-1/6245817279001/profile_0/chunklist.m3u8"
}, {
    id: "cw_gold",
    name: "Cw Gold",
    type: "m3u8",
    logo: "https://i.imgur.com/92Uid6m.jpeg",
    src: "https://d1d726ny1vain2.cloudfront.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-femoe55fvrdvc/playlist.m3u8"
}, {
    id: "cw_forever",
    name: "Cw Forever",
    type: "m3u8",
    logo: "https://i.imgur.com/oSlmQb6.jpeg",
    src: "https://d1sknsnbkyvie.cloudfront.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-sbcl5hxexbihh/playlist.m3u8"
}, {
    id: "paramount",
    name: "Paramount Network",
    type: "m3u8",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Paramount_Network.svg/512px-Paramount_Network.svg.png",
    src: "https://fl31.moveonjoy.com/PARAMOUNT_NETWORK/tracks-v1a1/mono.ts.m3u8"
}, {
    id: "mgm_plus",
    name: "Mgm+",
    type: "m3u8",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/MGM%2B_logo.svg/512px-MGM%2B_logo.svg.png",
    src: "https://fl31.moveonjoy.com/EPIX/tracks-v1a1/mono.ts.m3u8"
}, {
    id: "hallmark_mystery",
    name: "Hallmark Mysteries",
    type: "m3u8",
    logo: "https://i.imgur.com/GPRGA9C.png",
    src: "https://fl61.moveonjoy.com/HALLMARK_MOVIES_MYSTERIES/tracks-v1a1/mono.ts.m3u8"
}, {
    id: "sine_manila",
    name: "Sine Manila",
    type: "m3u8",
    logo: "https://i.imgur.com/zcFUYC5.png",
    src: "https://live20.bozztv.com/giatv/giatv-sinemanila/sinemanila/chunks.m3u8"
}, {
    id: "rage_tv",
    name: "Rage Tv",
    type: "m3u8",
    logo: "https://i.imgur.com/E3q2kTu.png",
    src: "https://live20.bozztv.com/giatv/giatv-ragetv/ragetv/chunks.m3u8"
}, {
    id: "amc",
    name: "Amc",
    type: "m3u8",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/AMC_logo_2019.svg/512px-AMC_logo_2019.svg.png",
    src: "https://fl61.moveonjoy.com/AMC_NETWORK/tracks-v1a1/mono.ts.m3u8"
}, {
    id: "sundance",
    name: "Sundance",
    type: "m3u8",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/SundanceTV_2014.svg/512px-SundanceTV_2014.svg.png",
    src: "https://fl61.moveonjoy.com/SUNDANCE/tracks-v1a1/mono.ts.m3u8"
}, {
    id: "lifetime_movies",
    name: "Lifetime Movies",
    type: "m3u8",
    logo: "https://i.postimg.cc/RZGmYyTt/lifetimemovies.png",
    src: "https://fl61.moveonjoy.com/LIFETIME_MOVIE_NETWORK/tracks-v1a1/mono.ts.m3u8"
}, {
    id: "gusto_tv",
    name: "Gusto Tv",
    type: "m3u8",
    logo: "https://i.imgur.com/GHVO6Gb.jpeg",
    src: "https://amg01077-gusto-gustous-firetv.amagi.tv/360p-cc/index.m3u8"
}, {
    id: "ani_one",
    name: "Ani One",
    type: "m3u8",
    logo: "https://www.medialink.com.hk/img/ani-one-logo.jpg",
    src: "https://amg19223-amg19223c9-amgplt0019.playout.now3.amagi.tv/playlist/amg19223-amg19223c9-amgplt0019/playlist.m3u8"
}, {
    id: "aniplus",
    name: "Aniplus",
    type: "m3u8",
    logo: "https://i.imgur.com/TXTluER.png",
    src: "https://amg18481-amg18481c1-amgplt0352.playout.now3.amagi.tv/playlist/amg18481-amg18481c1-amgplt0352/playlist.m3u8"
}, {
    id: "anime_x",
    name: "AnimeX",
    type: "m3u8",
    logo: "https://logomakerr.ai/uploads/output/2023/08/01/8d87f4803925f46fcdb6b9ae8a1e6244.jpg",
    src: "https://live20.bozztv.com/giatv/giatv-animex/animex/chunks.m3u8"
}, {
    id: "red_bull",
    name: "Red Bull",
    type: "m3u8",
    logo: "https://i.imgur.com/Ju6FJNA.png",
    src: "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master_3360.m3u8"
}, {
    id: "reuters",
    name: "Reuters",
    type: "m3u8",
    logo: "https://i.ibb.co/DCntyzt/reuterstv.png",
    src: "https://amg00453-reuters-amg00453c1-samsung-de-2111.playouts.now.amagi.tv/playlist/amg00453-reuters-reuters-samsungde/playlist.m3u8"
}, {
    id: "rt",
    name: "Rt",
    type: "m3u8",
    logo: "https://i.imgur.com/QKkQtFg.png",
    src: "https://rt-glb.rttv.com/dvr/rtnews/playlist_4500Kb.m3u8"
}, {
    id: "wedotvmovies",
    name: "Wedo Tv Movies",
    type: "m3u8",
    logo: "https://i.imgur.com/ZqTA686.png",
    src: "https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg00735-videosolutionsa-w4freemovies-tcl/playlist.m3u8"
}, {
    id: "wion",
    name: "Wion",
    type: "m3u8",
    logo: "https://i.imgur.com/1l1FdVb.jpeg",
    src: "https://d7x8z4yuq42qn.cloudfront.net/index_7.m3u8"
}, {
    id: "me_tv",
    name: "Me Tv",
    type: "m3u8",
    logo: "https://i.imgur.com/4xivX4u.jpeg",
    src: "https://fl61.moveonjoy.com/ME_TV/tracks-v1a1/mono.ts.m3u8"
}, {
    id: "grit",
    name: "Grit",
    type: "m3u8",
    logo: "https://i.imgur.com/j3A1Q8X.png",
    src: "https://fl31.moveonjoy.com/GRIT_TV/tracks-v1a1/mono.ts.m3u8"
}, {
    id: "blastx",
    name: "Blast X",
    type: "m3u8",
    logo: "https://i.imgur.com/KMQ1yVG.jpeg",
    src: "https://amg19223-amg19223c9-amgplt0019.playout.now3.amagi.tv/playlist/amg19223-amg19223c9-amgplt0019/playlist.m3u8"
}, {
    id: "classic_cinema",
    name: "Classic Cinema",
    type: "m3u8",
    logo: "https://i.imgur.com/FJoPnTb.png",
    src: "https://rpn.bozztv.com/gusa/gusa-classiccinema/index.m3u8"
}
];

/* RENDER */
function render(f="") {
    list.innerHTML = "";
    channels.filter(c=>c.name.toLowerCase().includes(f)).forEach(c=>{
        const d = document.createElement("div");
        d.className = "channel";
        d.innerHTML = `<img src="${c.logo}"><span>${c.name}</span>`;
        if (currentChannel?.id === c.id) {
            d.innerHTML += `<span class="live-badge">LIVE</span>`;
        }
        d.onclick = ()=>play(c, true);
        list.appendChild(d);
    }
    );
}
render();
search.oninput = ()=>render(search.value.toLowerCase());

/* AUTO SKIP DEAD */
function playNext() {
    const i = channels.findIndex(c=>c.id === currentChannel?.id);
    play(channels[i + 1] || channels[0], true);
}

/* PLAY */
async function play(ch, updateURL=false) {
    currentChannel = ch;
    render(search.value.toLowerCase());
    localStorage.setItem("lastChannel", ch.id);

    if (updateURL) {
        history.pushState({}, "", "?channel=" + ch.id);
    }

    if (hls) {
        hls.destroy();
        hls = null;
    }
    if (shakaPlayer) {
        await shakaPlayer.destroy();
        shakaPlayer = null;
    }

    video.pause();
    video.removeAttribute("src");
    video.load();

    if (ch.type === "m3u8") {
        if (Hls.isSupported()) {
            hls = new Hls();
            hls.loadSource(ch.src);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, ()=>video.play());
            hls.on(Hls.Events.ERROR, (e,d)=>{
                if (d.fatal)
                    setTimeout(playNext, 1500);
            }
            );
        } else {
            video.src = ch.src;
            video.play();
        }
    }

    if (ch.type === "mpd") {
        shakaPlayer = new shaka.Player(video);
        if (ch.drm === "clearkey") {
            shakaPlayer.configure({
                drm: {
                    clearKeys: {
                        [ch.keyId]: ch.key
                    }
                }
            });
        }
        try {
            await shakaPlayer.load(ch.src);
            video.play();
        } catch {
            setTimeout(playNext, 1500);
        }
    }

    drawer.classList.add("hide");
    resizeVideo(!!document.fullscreenElement);
}

/* VIDEO ERROR */
video.onerror = ()=>setTimeout(playNext, 1500);

/* AUTO LOAD */
const q = new URLSearchParams(location.search).get("channel");
const last = localStorage.getItem("lastChannel");
play(channels.find(c=>c.id === q) || channels.find(c=>c.id === last) || channels[0]);

/* AUTO DRAWER */
let t;
function showDrawer() {
    drawer.classList.remove("hide");
    clearTimeout(t);
    t = setTimeout(()=>drawer.classList.add("hide"), 5000);
}
["mousemove", "touchstart", "keydown"].forEach(e=>addEventListener(e, showDrawer));

/* DOUBLE TAP FULLSCREEN */
let lastTap = 0;
video.addEventListener("touchend", ()=>{
    const n = Date.now();
    if (n - lastTap < 300)
        toggleFS();
    lastTap = n;
}
);
video.addEventListener("dblclick", toggleFS);

async function toggleFS() {
    if (!document.fullscreenElement) {
        await video.requestFullscreen();
        screen.orientation?.lock?.("landscape").catch(()=>{}
        );
    } else {
        document.exitFullscreen();
        screen.orientation?.unlock?.();
    }
}
