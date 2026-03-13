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
function resizeVideo() {
    if (document.fullscreenElement) {
        video.style.objectFit = "contain";
    } else {
        video.style.objectFit = "contain";
    }
}
addEventListener("resize", ()=>resizeVideo(!!document.fullscreenElement));
addEventListener("orientationchange", ()=>resizeVideo(!!document.fullscreenElement));

/* CHANNEL LIST */
        const channels = [
  {
    id: "oneph",
    name: "One PH",
    logo: "https://i.imgur.com/gkluDe9.png",
    drm: "clearkey",
    keyId: "b1c7e9d24f8a4d6c9e337a2f1c5b8d60",
    key: "8ff2e524cc1e028f2a4d4925e860c796",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/oneph_sd/default/index.mpd",
  },
  {
    id: "kapatidchannel",
    name: "Kapatid Channel",
    logo: "https://i.imgur.com/BUVWBm2.png",
    drm: "clearkey",
    keyId: "045d103180f64562b1db7c932741c3ba",
    key: "c3380548b9075c767a6ae2006ef4bff8",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/kapatid_hd/default/index.mpd",
  },
  {
    id: "buko",
    name: "BuKO",
    logo: "https://i.imgur.com/Wv0K5Yc.png",
    drm: "clearkey",
    keyId: "d273c085f2ab4a248e7bfc375229007d",
    key: "7932354c3a84f7fc1b80efa6bcea0615",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/cg_buko_sd/default/index.mpd",
  },
  {
    id: "sarisari",
    name: "SARI-SARI",
    logo: "https://static.wikia.nocookie.net/russel/images/e/ec/Sari-Sari_Channel_2D_Logo_2016.png/revision/latest?cb=20190317023940",
    drm: "clearkey",
    keyId: "0a7ab3612f434335aa6e895016d8cd2d",
    key: "b21654621230ae21714a5cab52daeb9d",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_sarisari/default/index.mpd",
  },
  {
    id: "ptv4",
    name: "PTV4",
    logo: "https://static.wikia.nocookie.net/russel/images/d/dc/PTV_4_Para_Sa_Bayan_Alternative_Logo_June_2017.png/revision/latest?cb=20171019065428",
    drm: "clearkey",
    keyId: "71a130a851b9484bb47141c8966fb4a3",
    key: "ad1f003b4f0b31b75ea4593844435600",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/cg_ptv4_sd/default/index.mpd",
  },
  {
    id: "onenews",
    name: "One News",
    logo: "https://i.imgur.com/bpRiu54.png",
    drm: "clearkey",
    keyId: "2e6a9d7c1f4b4c8a8d33c7b1f0a5e924",
    key: "4c71e178d090332fbfe72e023b59f6d2",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/onenews_hd1/default/index.mpd",
  },
  {
    id: "rptv",
    name: "RPTV",
    logo: "https://static.wikia.nocookie.net/russel/images/f/fb/RPTV_Alternative_Logo_2024.png/revision/latest?cb=20240305140432",
    drm: "clearkey",
    keyId: "1917f4caf2364e6d9b1507326a85ead6",
    key: "a1340a251a5aa63a9b0ea5d9d7f67595",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cnn_rptv_prod_hd/default/index.mpd",
  },
  {
    id: "tv5",
    name: "TV5",
    logo: "https://static.wikia.nocookie.net/russel/images/7/7a/TV5_HD_Logo_2024.png/revision/latest/scale-to-width-down/290?cb=20240202141126",
    drm: "clearkey",
    keyId: "2615129ef2c846a9bbd43a641c7303ef",
    key: "07c7f996b1734ea288641a68e1cfdc4d",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/tv5_hd/default1/index.mpd",
  },
  {
    id: "a2z",
    name: "A2Z",
    logo: "https://static.wikia.nocookie.net/russel/images/8/85/A2Z_Channel_11_without_Channel_11_3D_Logo_2020.png/revision/latest?cb=20231101144828",
    drm: "clearkey",
    keyId: "3f6d8a2c1b7e4c9f8d52a7e1b0c6f93d",
    key: "4019f9269b9054a2b9e257b114ebbaf2",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_a2z/default/index.mpd",
  },
  {
    id: "bilyonaryochannel",
    name: "Bilyonaryo Channel",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcxvjeBIthYiEaZHeVeYpDicIlOTdv3G6lzoal3VM2xVzWu_J7XxM657oz&s=10",
    drm: "clearkey",
    keyId: "227ffaf09bec4a889e0e0988704d52a2",
    key: "b2d0dce5c486891997c1c92ddaca2cd2",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/bilyonaryoch/default/index.mpd",
  },
  {
    id: "tvnmoviespinoy",
    name: "tvN Movies Pinoy",
    logo: "https://static.wikia.nocookie.net/russel/images/e/e3/TvN_Movies_Pinoy_Logo_2023.png",
    drm: "clearkey",
    keyId: "2e53f8d8a5e94bca8f9a1e16ce67df33",
    key: "3471b2464b5c7b033a03bb8307d9fa35",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_tvnmovie/default/index.mpd",
  },
  {
    id: "pbo",
    name: "PBO",
    logo: "https://i.imgur.com/61fHpnW.png",
    drm: "clearkey",
    keyId: "dcbdaaa6662d4188bdf97f9f0ca5e830",
    key: "31e752b441bd2972f2b98a4b1bc1c7a1",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/pbo_sd/default/index.mpd",
  },
  {
    id: "vivacinema",
    name: "Viva Cinema",
    logo: "https://static.wikia.nocookie.net/tvfanon6528/images/2/2f/Viva_Cinema_%282021-.n.v.%29.png/revision/latest?cb=20210804092616",
    drm: "clearkey",
    keyId: "07aa813bf2c147748046edd930f7736e",
    key: "3bd6688b8b44e96201e753224adfc8fb",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/viva_sd/default/index.mpd",
  },
  {
    id: "tmc",
    name: "TMC",
    logo: "https://i.imgur.com/6mNCite.png",
    drm: "clearkey",
    keyId: "96701d297d1241e492d41c397631d857",
    key: "ca2931211c1a261f082a3a2c4fd9f91b",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/cg_tagalogmovie/default/index.mpd",
  },
  {
    id: "tapmovies",
    name: "Tap Movies",
    logo: "https://i.imgur.com/3RVA5mV.png",
    drm: "clearkey",
    keyId: "71cbdf02b595468bb77398222e1ade09",
    key: "c3f2aa420b8908ab8761571c01899460",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_tapmovies_hd1/default/index.mpd",
  },
  {
    id: "hbo",
    name: "HBO",
    logo: "https://images.now-tv.com/shares/channelPreview/img/en_hk/color/ch115_170_122",
    drm: "clearkey",
    keyId: "c2b7a1e95d4f4c3a8e617f9d0a2b6c18",
    key: "27fca1ab042998b0c2f058b0764d7ed4",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_hbohd/default/index.mpd",
  },
  {
    id: "hbohits",
    name: "HBO Hits",
    logo: "https://divign0fdw3sv.cloudfront.net/Images/ChannelLogo/contenthub/449_144.png",
    drm: "clearkey",
    keyId: "b04ae8017b5b4601a5a0c9060f6d5b7d",
    key: "a8795f3bdb8a4778b7e888ee484cc7a1",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_hbohits/default/index.mpd",
  },
  {
    id: "dreamworkstagalized",
    name: "DreamWorks (Tagalized)",
    logo: "https://i.imgur.com/cgfKSDP.png",
    drm: "clearkey",
    keyId: "564b3b1c781043c19242c66e348699c5",
    key: "d3ad27d7fe1f14fb1a2cd5688549fbab",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_dreamworktag/default/index.mpd",
  },
  {
    id: "pbarush",
    name: "PBA RUSH",
    logo: "https://i.imgur.com/F2npB7o.png",
    drm: "clearkey",
    keyId: "d7f1a9c36b2e4f8d9a441c5e7b2d8f60",
    key: "fb83c86f600ab945e7e9afed8376eb1e",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_pbarush_hd1/default/index.mpd",
  },
  {
    id: "onesports",
    name: "One Sports+",
    logo: "https://i.imgur.com/D33wRIq.png",
    drm: "clearkey",
    keyId: "f00bd0122a8a4da1a49ea6c49f7098ad",
    key: "a4079f3667ba4c2bcfdeb13e45a6e9c6",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_onesportsplus_hd1/default/index.mpd",
  },
  {
    id: "tapsports",
    name: "Tap Sports",
    logo: "https://i.imgur.com/ZsWDiRF.png",
    drm: "clearkey",
    keyId: "5e7c1b9a2d8f4a6c9f30b1d6e2a8c744",
    key: "6178d9d177689eec5028e2dd608ae7b6",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_tapsports/default/index.mpd",
  },
  {
    id: "knowledgechannel",
    name: "Knowledge Channel",
    logo: "https://i.imgur.com/UIqEr2y.png",
    drm: "clearkey",
    keyId: "c7d2b1e94f8a4d6c8a106b3d1f9c2e55",
    key: "2052f6b844aa53144bb32f0e41295106",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/knowledge_channel/default/index.mpd",
  },
  {
    id: "rockaction",
    name: "Rock Action",
    logo: "https://uploads-ssl.webflow.com/64e961c3862892bff815289d/64f57100366fe5c8cb6088a7_logo_ext_web.png?fbclid=IwY2xjawGIHF9leHRuA2FlbQIxMAABHaW0_Y0A9XL4w1ZXDSwAZCAxe62ui1Oy3gU5wjykfHsZ0eCjzNxl05M0JQ_aem_NIH5vZtTty4_B8wy5fB2LA",
    drm: "clearkey",
    keyId: "8d2a6f1c9b7e4c3da5f01e7b9c6d2f44",
    key: "23841651ebf49fa03fdfcd7b43337f87",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_rockextreme/default/index.mpd",
  },
  {
    id: "depedtv",
    name: "DepEd TV",
    logo: "https://static.wikia.nocookie.net/russel/images/f/f3/DepEd_TV_Logo_2020.png",
    drm: "clearkey",
    keyId: "0f853706412b11edb8780242ac120002",
    key: "2157d6529d80a760f60a8b5350dbc4df",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/depedch_sd/default/index.mpd",
  },
  {
    id: "fashiontv",
    name: "Fashion TV",
    logo: "https://i.imgur.com/Zd5zm7C.png",
    drm: "clearkey",
    keyId: "9d7c1f2a6b4e4a8d8f33c1e5b7d2a960",
    key: "3a18c535c52db7c79823f59036a9d195",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/fashiontvhd/default/index.mpd",
  },
  {
    id: "hbosignature",
    name: "HBO Signature",
    logo: "https://i.imgur.com/t4HF5va.png",
    drm: "clearkey",
    keyId: "a06ca6c275744151895762e0346380f5",
    key: "559da1b63eec77b5a942018f14d3f56f",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_hbosign/default/index.mpd",
  },
  {
    id: "kix",
    name: "KIX",
    logo: "https://i.imgur.com/B8Fmzer.png",
    drm: "clearkey",
    keyId: "c9d4b7a18e2f4d6c9a103f5b7e1c2d88",
    key: "7f3139092bf87d8aa51ee40e6294d376",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/kix_hd1/default/index.mpd",
  },
  {
    id: "warnertv",
    name: "Warner TV",
    logo: "https://i.imgur.com/vGEL2Ne.png",
    drm: "clearkey",
    keyId: "7f2a9c6d1e5b4c8a8d10a2b7e1c9f344",
    key: "ae3d135d5ddd9e8f3a7bbfbfae0e40d1",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/cg_warnerhd/default/index.mpd",
  },
  {
    id: "tvnpremium",
    name: "tvN Premium",
    logo: "https://i.imgur.com/eE9IBhJ.png",
    drm: "clearkey",
    keyId: "e1bde543e8a140b38d3f84ace746553e",
    key: "b712c4ec307300043333a6899a402c10",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_tvnpre/default/index.mpd",
  },
  {
    id: "history",
    name: "History",
    logo: "https://cantseeus.com/wp-content/uploads/2023/10/History_28201529.png",
    drm: "clearkey",
    keyId: "e2a8c7d15b9f4d6a9c101f7e3b2d8a44",
    key: "397ca914a73b1e00bc94ed9eccf9c258",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_historyhd/default/index.mpd",
  },
  {
    id: "bbcearth",
    name: "BBC Earth",
    logo: "https://imgur.com/QMB9sFW.png",
    drm: "clearkey",
    keyId: "34ce95b60c424e169619816c5181aded",
    key: "0e2a2117d705613542618f58bf26fc8e",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/cg_bbcearth_hd1/default/index.mpd",
  },
  {
    id: "uaapvarsitychannel",
    name: "UAAP Varsity Channel",
    logo: "https://i.imgur.com/V0sxXci.png",
    drm: "clearkey",
    keyId: "95588338ee37423e99358a6d431324b9",
    key: "6e0f50a12f36599a55073868f814e81e",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_uaap_cplay_sd/default/index.mpd",
  },
  {
    id: "truetv",
    name: "True TV",
    logo: "https://static.wikia.nocookie.net/logopedia/images/a/a0/TRUETV_Logo_2024.png/revision/latest/smart/width/250/height/250?cb=20241110070654",
    drm: "clearkey",
    keyId: "a4e2b9d61c754f3a8d109b6c2f1e7a55",
    key: "1d8d975f0bc2ed90eda138bd31f173f4",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/truefm_tv/default/index.mpd",
  },
  {
    id: "hbofamily",
    name: "HBO Family",
    logo: "https://divign0fdw3sv.cloudfront.net/Images/ChannelLogo/contenthub/450_144.png",
    drm: "clearkey",
    keyId: "872910c843294319800d85f9a0940607",
    key: "f79fd895b79c590708cf5e8b5c6263be",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_hbofam/default/index.mpd",
  },
  {
    id: "rockentertainment",
    name: "Rock Entertainment",
    logo: "https://cdn.prod.website-files.com/67ad5259c6e804a40b4bae92/67ad5259c6e804a40b4bb0c1_logo_ent_red_web.png",
    drm: "clearkey",
    keyId: "a8b2d6f14c9e4d7a8f552c1e9b7d6a30",
    key: "b61a33a4281e7c8e68b24b9af466f7b4",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_rockentertainment/default/index.mpd",
  },
  {
    id: "spotv",
    name: "SPOTV",
    logo: "https://linear-poster.astro.com.my/prod/logo/SPOTV.png",
    drm: "clearkey",
    keyId: "ec7ee27d83764e4b845c48cca31c8eef",
    key: "9c0e4191203fccb0fde34ee29999129e",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/cg_spotvhd/default/index.mpd",
  },
  {
    id: "spotv2",
    name: "SPOTV2",
    logo: "https://linear-poster.astro.com.my/prod/logo/SPOTV2.png",
    drm: "clearkey",
    keyId: "7eea72d6075245a99ee3255603d58853",
    key: "6848ef60575579bf4d415db1032153ed",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_spotv2hd/default/index.mpd",
  },
  {
    id: "premiersports2",
    name: "Premier Sports 2",
    logo: "https://static.wikia.nocookie.net/logopedia/images/5/59/PremierSports2_logo.png/revision/latest/scale-to-width-down/250?cb=20220528091432",
    drm: "clearkey",
    keyId: "59454adb530b4e0784eae62735f9d850",
    key: "61100d0b8c4dd13e4eb8b4851ba192cc",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/premiersports2hd/default/index.mpd",
  },
  {
    id: "nbatvphilippines",
    name: "NBA TV Philippines",
    logo: "https://i.imgur.com/x1ZG71v.png",
    drm: "clearkey",
    keyId: "d1f8a0c97b3d4e529a6f2c4b8d7e1f90",
    key: "58ab331d14b66bf31aca4284e0a3e536",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cgnl_nba/default/index.mpd",
  },
  {
    id: "cinemax",
    name: "Cinemax",
    logo: "https://divign0fdw3sv.cloudfront.net/Images/ChannelLogo/contenthub/337_144.png",
    drm: "clearkey",
    keyId: "b207c44332844523a3a3b0469e5652d7",
    key: "fe71aea346db08f8c6fbf0592209f955",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_cinemax/default/index.mpd",
  },
  {
    id: "lifetime",
    name: "Lifetime",
    logo: "https://i.imgur.com/Qvj8mf4.png",
    drm: "clearkey",
    keyId: "cf861d26e7834166807c324d57df5119",
    key: "64a81e30f6e5b7547e3516bbf8c647d0",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_lifetime/default/index.mpd",
  },
  {
    id: "foodnetwork",
    name: "Food Network",
    logo: "https://i.imgur.com/vucZeKB.png",
    drm: "clearkey",
    keyId: "4a9d2f7c1e6b4c8d8a55d7b1e3f0c926",
    key: "2e62531bdb450480a18197b14f4ebc77",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_foodnetwork_hd1/default/index.mpd",
  },
  {
    id: "axn",
    name: "AXN",
    logo: "http://linear-poster.astro.com.my/prod/logo/AXN_v1.png",
    drm: "clearkey",
    keyId: "8a6c2f1e9d7b4c5aa1f04d2b7e9c1f88",
    key: "05e6bfa4b6805c46b772f35326b26b36",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_axn_sd/default/index.mpd",
  },
  {
    id: "abcaustralia",
    name: "ABC Australia",
    logo: "https://i.imgur.com/kVVax44.png",
    drm: "clearkey",
    keyId: "d6f1a8c29b7e4d5a8f332c1e9d7b6a90",
    key: "790bd17b9e623e832003a993a2de1d87",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/abc_aus/default/index.mpd",
  },
  {
    id: "travelchannel",
    name: "Travel Channel",
    logo: "https://i.imgur.com/ZCYeUV2.png",
    drm: "clearkey",
    keyId: "f3047fc13d454dacb6db4207ee79d3d3",
    key: "bdbd38748f51fc26932e96c9a2020839",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/travel_channel_sd/default/index.mpd",
  },
  {
    id: "bloomberg",
    name: "Bloomberg",
    logo: "https://poster.starhubgo.com/Linear_channels2/708_1920x1080_HTV.png",
    drm: "clearkey",
    keyId: "3b8e6d1f2c9a4f7d9a556c1e7b2d8f90",
    key: "09f0bd803966c4befbd239cfa75efe23",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/bloomberg_sd/default/index.mpd",
  },
  {
    id: "bbcnews",
    name: "BBC News",
    logo: "https://logos-world.net/wp-content/uploads/2024/12/BBC-News-Logo-500x281.png",
    drm: "clearkey",
    keyId: "f59650be475e4c34a844d4e2062f71f3",
    key: "119639e849ddee96c4cec2f2b6b09b40",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/bbcworld_news_sd/default/index.mpd",
  },
  {
    id: "cartoonnetwork",
    name: "Cartoon Network",
    logo: "https://poster.starhubgo.com/Linear_channels2/316_1920x1080_HTV.png",
    drm: "clearkey",
    keyId: "a2d1f552ff9541558b3296b5a932136b",
    key: "cdd48fa884dc0c3a3f85aeebca13d444",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cartoonnetworkhd/default/index.mpd",
  },
  {
    id: "dreamworks",
    name: "DreamWorks",
    logo: "https://i.imgur.com/cgfKSDP.png",
    drm: "clearkey",
    keyId: "7b1e9c4d5a2f4d8c9f106d3a8b2c1e77",
    key: "8b2904224c6cee13d2d4e06c0a3b2887",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_dreamworks_hd1/default/index.mpd",
  },
  {
    id: "hitsnow",
    name: "HITS Now",
    logo: "https://aqfadtv.xyz/logos/HITSNow.png",
    drm: "clearkey",
    keyId: "f9c3d6b18a2e4d7f9e453b1a8c6d2f70",
    key: "ce8874347ec428c624558dcdc3575dd4",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_hitsnow/default/index.mpd",
  },
  {
    id: "moonbug",
    name: "Moonbug",
    logo: "https://aqfadtv.xyz/logos/Moonbug.png",
    drm: "clearkey",
    keyId: "0bf00921bec94a65a124fba1ef52b1cd",
    key: "0f1488487cbe05e2badc3db53ae0f29f",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_moonbug_kids_sd/default/index.mpd",
  },
  {
    id: "celestialmoviespinoy",
    name: "Celestial Movies Pinoy",
    logo: "https://i.imgur.com/e5IZsv3.png",
    drm: "clearkey",
    keyId: "0f8537d8412b11edb8780242ac120002",
    key: "2ffd7230416150fd5196fd7ea71c36f3",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/celmovie_pinoy_sd/default/index.mpd",
  },
  {
    id: "hitsmovies",
    name: "HITS Movies",
    logo: "https://divign0fdw3sv.cloudfront.net/Images/ChannelLogo/contenthub/391_144.png",
    drm: "clearkey",
    keyId: "2c8a5f1e7b9d4c6a9e55f1d7b2a8c360",
    key: "c9f622dff27e9e1c1f78617ba3b81a62",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_hitsmovies/default/index.mpd",
  },
  {
    id: "thrill",
    name: "THRILL",
    logo: "https://static.wikia.nocookie.net/logos/images/9/9c/Thrill_logo_2014.png/revision/latest/scale-to-width-down/306?cb=20220502112950&path-prefix=vi",
    drm: "clearkey",
    keyId: "928114ffb2394d14b5585258f70ed183",
    key: "a82edc340bc73447bac16cdfed0a4c62",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/cg_thrill_sd/default/index.mpd",
  },
  {
    id: "lotusmacao",
    name: "Lotus Macao",
    logo: "https://cms.cignal.tv/Upload/Thumbnails/mo-macau-lotus-tv-3757.png",
    drm: "clearkey",
    keyId: "9a7c2d1f4e8b4a6d8f301b5c9e7d2a44",
    key: "ca88469cabc18aa33d1f2e46a6efb4f7",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/lotusmacau_prd/default/index.mpd",
  },
  {
    id: "discoverychannel",
    name: "Discovery Channel",
    logo: "https://cantseeus.com/wp-content/uploads/2023/10/discov.png",
    drm: "clearkey",
    keyId: "d9ac48f5131641a789328257e778ad3a",
    key: "b6e67c37239901980c6e37e0607ceee6",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/discovery/default/index.mpd",
  },
  {
    id: "asianfoodnetwork",
    name: "Asian Food Network",
    logo: "https://i.imgur.com/O5jBcL2.png",
    drm: "clearkey",
    keyId: "1619db30b9ed42019abb760a0a3b5e7f",
    key: "5921e47fb290ae263291b851c0b4b6e4",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/asianfoodnetwork_sd/default/index.mpd",
  },
  {
    id: "nhkworldjapan",
    name: "NHK World Japan",
    logo: "https://i.imgur.com/3zp7a0B.png",
    drm: "clearkey",
    keyId: "3d6e9d4de7d7449aadd846b7a684e564",
    key: "0800fff80980f47f7ac6bc60b361b0cf",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_nhk_japan/default/index.mpd",
  },
  {
    id: "animalplanet",
    name: "Animal Planet",
    logo: "https://i.ibb.co/mBFs4RQ/pinpng-com-animal-planet-png-4851143.png",
    drm: "clearkey",
    keyId: "1c9f7a6d3b2e4e5d8a61f4d0c2b9e813",
    key: "b8f52451c67a2b54f272543eef45b621",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/cg_animal_planet_sd/default/index.mpd",
  },
  {
    id: "kbsworld",
    name: "KBS World",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjrxyZu1bPiJ3SdGvhVf3d3Muj5AqQ7ZkGpw&s",
    drm: "clearkey",
    keyId: "22ff2347107e4871aa423bea9c2bd363",
    key: "c6e7ba2f48b3a3b8269e8bc360e60404",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/kbsworld/default/index.mpd",
  },
  {
    id: "cnninternational",
    name: "CNN International",
    logo: "http://115.146.176.131:80/images/2acf9495fde07739914e7a7bb3ffee94.png",
    drm: "clearkey",
    keyId: "900c43f0e02742dd854148b7a75abbec",
    key: "da315cca7f2902b4de23199718ed7e90",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_cnnhd/default/index.mpd",
  },
  {
    id: "france24",
    name: "France24",
    logo: "https://i.imgur.com/61MSiq9.png",
    drm: "clearkey",
    keyId: "257f9fdeb39d41bdb226c2ae1fbdaeb6",
    key: "e80ead0f4f9d6038ab34f332713ceaa5",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/france24/default/index.mpd",
  },
  {
    id: "ibc13",
    name: "IBC 13",
    logo: "https://static.wikia.nocookie.net/logopedia/images/f/f5/IBC_13_Logo_2012.png/revision/latest?cb=20170830080345",
    drm: "clearkey",
    keyId: "16ecd238c0394592b8d3559c06b1faf5",
    key: "05b47ae3be1368912ebe28f87480fc84",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/ibc13_sd_new/default1/index.mpd",
  },
  {
    id: "onesportshd",
    name: "One Sports HD",
    logo: "https://static.wikia.nocookie.net/russel/images/5/5a/One_Sports_%28TV_channel%29_3D_Logo_2020.png/revision/latest?cb=20230520142737",
    drm: "clearkey",
    keyId: "53c3bf2eba574f639aa21f2d4409ff11",
    key: "3de28411cf08a64ea935b9578f6d0edd",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_onesports_hd/default/index.mpd",
  },
  {
    id: "premiersports",
    name: "Premier Sports",
    logo: "https://static.wikia.nocookie.net/logopedia/images/6/63/Premier_Sports_logo_final.png/revision/latest?cb=20210920130931",
    drm: "clearkey",
    keyId: "b8b595299fdf41c1a3481fddeb0b55e4",
    key: "cd2b4ad0eb286239a4a022e6ca5fd007",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_ps_hd1/default/index.mpd",
  },
  {
    id: "animax",
    name: "Animax",
    logo: "https://i.imgur.com/MiUDLVa.png",
    drm: "clearkey",
    keyId: "1e7b9d2c6a4f4d8c9f33b5c1a8d7e260",
    key: "67336c0c5b24fb4b8caac248dad3c55d",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/cg_animax_sd_new/default/index.mpd",
  },
  {
    id: "hitshd",
    name: "Hits HD",
    logo: "https://i.imgur.com/YeqyD9W.png",
    drm: "clearkey",
    keyId: "6d2f8a1c9b5e4c7da1f03e7b9d6c2a55",
    key: "37c9835795779f8d848a6119d3270c69",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/hits_hd1/default/index.mpd",
  },
  {
    id: "globaltrekker",
    name: "Global Trekker",
    logo: "https://divign0fdw3sv.cloudfront.net/Images/ChannelLogo/contenthub/482_144.png",
    drm: "clearkey",
    keyId: "b7a6c5d23f1e4a9d8c721e5d9f4a6b13",
    key: "63ca9ad0d88fccb8c667b028f47287ba",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/globaltrekker/default/index.mpd",
  },
  {
    id: "cctv4",
    name: "CCTV4",
    logo: "https://i.imgur.com/HBisPOA.png",
    drm: "clearkey",
    keyId: "b83566836c0d4216b7107bd7b8399366",
    key: "32d50635bfd05fbf8189a0e3f6c8db09",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_cctv4/default/index.mpd",
  },
  {
    id: "tv5monde",
    name: "TV5 Monde",
    logo: "https://klean.nl/wp-content/uploads/Logo_TV5_Monde_-_2021.svg_.png",
    drm: "clearkey",
    keyId: "fba5a720b4a541b286552899ba86e38b",
    key: "f63fa50423148bfcbaa58c91dfcffd0e",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_tv5_monde/default/index.mpd",
  },
  {
    id: "nickelodeon",
    name: "Nickelodeon",
    logo: "http://apkip.tv/logos/UK/Nickelodeon.uk.png",
    drm: "clearkey",
    keyId: "9ce58f37576b416381b6514a809bfd8b",
    key: "f0fbb758cdeeaddfa3eae538856b4d72",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_nickelodeon/default/index.mpd",
  },
  {
    id: "nickjr",
    name: "Nick Jr",
    logo: "https://i.imgur.com/4MozyqM.png",
    drm: "clearkey",
    keyId: "bab5c11178b646749fbae87962bf5113",
    key: "0ac679aad3b9d619ac39ad634ec76bc8",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_nickjr/default/index.mpd",
  },
  {
    id: "hgtv",
    name: "HGTV",
    logo: "https://divign0fdw3sv.cloudfront.net/Images/ChannelLogo/contenthub/198_144.png",
    drm: "clearkey",
    keyId: "f1e8c2d97a3b4f5d8c669d1a2b7e4c30",
    key: "03aaa7dcf893e6b934aeb3c46f9df5b9",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/hgtv_hd1/default/index.mpd",
  },
  {
    id: "crimeinvestigation",
    name: "Crime & Investigation",
    logo: "https://divign0fdw3sv.cloudfront.net/Images/ChannelLogo/contenthub/369_144.png",
    drm: "clearkey",
    keyId: "21e2843b561c4248b8ea487986a16d33",
    key: "db6bb638ccdfc1ad1a3e98d728486801",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/crime_invest/default/index.mpd",
  },
  {
    id: "tvmaria",
    name: "TV Maria",
    logo: "https://static.wikia.nocookie.net/logopedia/images/c/cd/TV_MARIA_PH.png/revision/latest?cb=20200421061144",
    drm: "clearkey",
    keyId: "fa3998b9a4de40659725ebc5151250d6",
    key: "998f1294b122bbf1a96c1ddc0cbb229f",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/tvmaria_prd/default/index.mpd",
  },
  {
    id: "wiltv",
    name: "Wil TV",
    logo: "https://static.wikia.nocookie.net/tv-philippines/images/4/43/WILTV_logo.png/revision/latest?cb=20251214021032",
    drm: "clearkey",
    keyId: "b1773d6f982242cdb0f694546a3db26f",
    key: "ae9a90dbea78f564eb98fe817909ec9a",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/wiltv/default/index.mpd",
  },
  {
    id: "arirang",
    name: "Arirang",
    logo: "http://115.146.176.131/images/14a646307c92e88856903295e6fa0d5c.png",
    drm: "clearkey",
    keyId: "13815d0fa026441ea7662b0c9de00bcf",
    key: "2d99a55743677c3879a068dd9c92f824",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/arirang_sd/default/index.mpd",
  },
  {
    id: "aljazeera",
    name: "Al Jazeera",
    logo: "https://logos-world.net/wp-content/uploads/2023/04/Al-Jazeera-Logo.png",
    drm: "clearkey",
    keyId: "7f3d900a04d84492b31fe9f79ac614e3",
    key: "d33ff14f50beac42969385583294b8f2",
    type: "mpd",
    src: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_aljazeera/default/index.mpd",
  },
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
