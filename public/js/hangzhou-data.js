/* Trip data — shared across pages */
var PINS = window.PINS = {
  homeinn_hz: {
    group: "hotel",
    k: "khách sạn Hàng Châu · 08–10/01 · 2 đêm",
    vi: "Homeinn Selected Định An Lộ",
    name: "如家精选酒店(杭州西湖湖滨定安路地铁站店)",
    zh: "杭州市上城区延安路126号耀江大厦A座",
    img: "img/sight-westlake.jpg",
    tel: "0571-86077977",
    lat: "30.244835", lng: "120.165478",
    amap: "https://www.amap.com/?p=B0I1PYM4KB,30.244835,120.165478,%E5%A6%82%E5%AE%B6%E7%B2%BE%E9%80%89%E9%85%92%E5%BA%97(%E6%9D%AD%E5%B7%9E%E8%A5%BF%E6%B9%96%E6%B9%96%E6%BB%A8%E5%AE%9A%E5%AE%89%E8%B7%AF%E5%9C%B0%E9%93%81%E7%AB%99%E5%BA%97),%E5%BB%B6%E5%AE%89%E8%B7%AF126"
  },
  wuzhen_visitor: {
    group: "hotel",
    k: "khách sạn Ô Trấn · giao vali ở đây",
    vi: "Trung tâm khách Tây Sách",
    name: "乌镇西栅景区1号游客服务中心",
    zh: "浙江省桐乡市乌镇西栅游客服务中心",
    img: "img/hotel-wuzhen.jpg",
    tel: "+86-573-88731088",
    lat: "30.748054", lng: "120.489158",
    amap: "https://www.amap.com/?p=B0H6ORT05Y,30.748054,120.489158,%E4%B9%8C%E9%95%87%E8%A5%BF%E6%A0%85%E6%99%AF%E5%8C%BA1%E5%8F%B7%E6%B8%B8%E5%AE%A2%E6%9C%8D%E5%8A%A1%E4%B8%AD%E5%BF%83,%E4%B9%8C%E9%95%87%E8%A5%BF%E6%A0%85%E5%A4%A7%E8%A1%97129%E5%8F%B7%E8%A5%BF%E6%A0%85%E6%99%AF%E5%8C%BA%E5%86%85"
  },
  homeinn_sh: {
    group: "hotel",
    k: "khách sạn Thượng Hải · 11–13/01",
    vi: "Homeinn Bến Thượng Hải Center",
    name: "如家商旅酒店(上海南京路步行街外滩中心店)",
    zh: "上海市黄浦区江西中路135弄11号",
    img: "img/sight-bund.jpg",
    tel: "+86-21-63239966",
    lat: "31.233775", lng: "121.486551",
    amap: "https://www.amap.com/?p=B00155KKGY,31.233775,121.486551,%E5%A6%82%E5%AE%B6%E5%95%86%E6%97%85%E9%85%92%E5%BA%97(%E4%B8%8A%E6%B5%B7%E5%8D%97%E4%BA%AC%E8%B7%AF%E6%AD%A5%E8%A1%8C%E8%A1%97%E5%A4%96%E6%BB%A9%E4%B8%AD%E5%BF%83%E5%BA%97),%E6%B1%9F%E8%A5%BF%E4%B8%AD%E8%B7%AF135%E5%BC%8411%E5%8F%B7"
  },
  pvg: { group: "transit", k: "Sân bay", vi: "sân bay Phố Đông, nhà ga 2", name: "上海浦东国际机场T2", zh: "上海浦东国际机场T2航站楼", img: "img/transit-pvg.jpg", lat: "31.144343", lng: "121.808273" },
  hongqiao_hub: { group: "transit", k: "Xuống bus đêm", vi: "Hồng Kiều Đông giao thông", name: "虹桥枢纽东交通中心", zh: "上海市闵行区虹桥枢纽东交通中心", img: "img/transit-pvg.jpg" },
  hongqiao_station: { group: "transit", k: "Ga tàu", vi: "Ga Hồng Kiều", name: "上海虹桥站", zh: "上海虹桥站", img: "img/transit-pvg.jpg" },
  hz_east: { group: "transit", k: "Ga tàu 08/01", vi: "Hàng Châu Đông", name: "杭州东站", zh: "杭州东站", img: "img/sight-westlake.jpg", lat: "30.291167", lng: "120.212494" },
  hz_chengzhan_bus: {
    group: "transit", k: "10/01 lên xe khách", vi: "Bến 城站 (gần KS)",
    name: "杭州城站汽车客运站", zh: "杭州市上城区环城东路12号杭州城站汽车客运站",
    img: "img/sight-qinghefang.jpg", tel: "0571-87068785"
  },
  hz_east_bus: {
    group: "transit", k: "10/01 bến dự phòng", vi: "Bến xe khách ga Đông",
    name: "杭州长运火车东站公路汽车站", zh: "杭州火车东站东广场G层北侧杭州长运公路汽车站",
    img: "img/sight-westlake.jpg", tel: "0571-87650505"
  },
  tongxiang: { group: "transit", k: "Chỉ khi lỡ xe khách", vi: "Ga Đồng Hương", name: "桐乡站", zh: "桐乡站", img: "img/sight-wuzhen.jpg" },
  wuzhen_p1: {
    group: "transit", k: "11/01 lên xe khách", vi: "Bãi 1 Tây Sách",
    name: "乌镇西栅景区1号停车场", zh: "浙江省桐乡市乌镇西栅景区1号停车场",
    img: "img/sight-wuzhen.jpg"
  },
  sh_south: { group: "transit", k: "Xe khách tới đây", vi: "Bến Nam Thượng Hải", name: "上海长途客运南站", zh: "上海长途客运南站", img: "img/sight-lujiazui.jpg" },
  liulang: {
    group: "sight", k: "08/01 sáng", vi: "Liễu Lãng Văn Oanh",
    name: "杭州西湖风景名胜区-柳浪闻莺", zh: "杭州市西湖区南山路87号柳浪闻莺",
    img: "img/sight-westlake.jpg", lat: "30.240389", lng: "120.156326",
    amap: "https://www.amap.com/?p=B023B0247C,30.240389,120.156326,%E6%9D%AD%E5%B7%9E%E8%A5%BF%E6%B9%96%E9%A3%8E%E6%99%AF%E5%90%8D%E8%83%9C%E5%8C%BA-%E6%9F%B3%E6%B5%AA%E9%97%BB%E8%8E%BA,%E5%8D%97%E5%B1%B1%E8%B7%AF87%E5%8F%B7"
  },
  duanqiao: { group: "sight", k: "08/01 sáng", vi: "Đoạn Kiều", name: "断桥", zh: "杭州市西湖区北山路断桥残雪", img: "img/sight-westlake.jpg" },
  leifeng: { group: "sight", k: "09/01 chiều · option", vi: "Lôi Phong Tháp", name: "雷峰塔", zh: "杭州市西湖区南山路15号雷峰塔", img: "img/sight-westlake.jpg" },
  tea_street: { group: "sight", k: "09/01 mua trà", vi: "Hữu Thánh Quan Lộ", name: "佑圣观路", zh: "杭州市上城区佑圣观路", img: "img/sight-qinghefang.jpg" },
  qinghefang: {
    group: "sight", k: "08/01 chiều", vi: "Thanh Hà Phường",
    name: "清河坊历史文化特色街区", zh: "杭州市上城区河坊街180号清河坊",
    img: "img/sight-qinghefang.jpg", lat: "30.239827", lng: "120.169899",
    amap: "https://www.amap.com/?p=B023B07SJZ,30.239827,120.169899,%E6%B8%85%E6%B2%B3%E5%9D%8A%E5%8E%86%E5%8F%B2%E6%96%87%E5%8C%96%E7%89%B9%E8%89%B2%E8%A1%97%E5%8C%BA,%E6%B2%B3%E5%9D%8A%E8%A1%97180%E5%8F%B7"
  },
  dujinsheng: { group: "sight", k: "09/01 sáng", vi: "Đô Cẩm Sinh (lụa)", name: "都锦生", zh: "杭州市上城区龙游路48号都锦生", img: "img/sight-qinghefang.jpg" },
  wuzhen_xizha: {
    group: "sight", k: "10–11/01", vi: "Tây Sách",
    name: "乌镇西栅景区", zh: "浙江省桐乡市乌镇石佛南路18号西栅景区",
    img: "img/sight-wuzhen.jpg", lat: "30.750270", lng: "120.484263",
    amap: "https://www.amap.com/?p=B023D02SCY,30.750270,120.484263,%E4%B9%8C%E9%95%87%E8%A5%BF%E6%A0%85%E6%99%AF%E5%8C%BA,%E7%9F%B3%E4%BD%9B%E5%8D%97%E8%B7%AF18%E5%8F%B7"
  },
  bund: {
    group: "sight", k: "11/01 tối", vi: "Bến Thượng Hải",
    name: "外滩", zh: "上海市黄浦区中山东一路外滩",
    img: "img/sight-bund.jpg", lat: "31.233516", lng: "121.492127",
    amap: "https://www.amap.com/?p=B00155FXB3,31.233516,121.492127,%E5%A4%96%E6%BB%A9,%E4%B8%AD%E5%B1%B1%E4%B8%9C%E4%B8%80%E8%B7%AF"
  },
  lujiazui: { group: "sight", k: "11/01 tối", vi: "Lục Gia Chủy — cầu đi bộ / Minh Châu", name: "陆家嘴", zh: "上海市浦东新区陆家嘴环路步行桥", img: "img/sight-lujiazui.jpg" },
  disney: {
    group: "sight", k: "12/01 cả ngày", vi: "Shanghai Disneyland",
    name: "上海迪士尼乐园", zh: "上海市浦东新区申迪西路753号上海迪士尼乐园",
    img: "img/sight-disney.jpg", lat: "31.143212", lng: "121.660294",
    amap: "https://www.amap.com/?p=B0KDJ78DYD,31.143212,121.660294,%E4%B8%8A%E6%B5%B7%E8%BF%AA%E5%A3%AB%E5%B0%BC%E4%B9%90%E5%9B%AD,%E7%94%B3%E8%BF%AA%E8%A5%BF%E8%B7%AF753%E5%8F%B7%E4%B8%8A%E6%B5%B7%E8%BF%AA%E5%A3%AB%E5%B0%BC%E5%BA%A6%E5%81%87%E5%8C%BA"
  },
  wukang: { group: "sight", k: "13/01 sáng", vi: "Tòa Vũ Khang", name: "武康大楼", zh: "上海市徐汇区武康路武康大楼", img: "img/sight-wukang.jpg" },
  xintiandi: { group: "sight", k: "13/01 chiều", vi: "Tân Thiên Địa", name: "新天地", zh: "上海市黄浦区太仓路181弄新天地", img: "img/sight-xintiandi.jpg" },
  tianzifang: { group: "sight", k: "13/01 chiều", vi: "Điền Tử Phường", name: "田子坊", zh: "上海市黄浦区泰康路210弄田子坊", img: "img/sight-xintiandi.jpg" },
  yuyuan: {
    group: "sight", k: "13/01 tối — ghim cổng 5", vi: "Dự Viên thương thành",
    name: "豫园商城5号门", zh: "上海市黄浦区豫园商城5号门",
    img: "img/sight-yuyuan.jpg", lat: "31.226425", lng: "121.491239",
    amap: "https://www.amap.com/?p=B0FFJURK3P,31.226425,121.491239,%E8%B1%AB%E5%9B%AD%E5%95%86%E5%9F%8E,%E6%96%B9%E6%B5%9C%E4%B8%AD%E8%B7%AF265%E5%8F%B7"
  },
  waipojia: {
    group: "food", kind: "eat", area: "hz_duanqiao", k: "Trưa 08/01", vi: "Grandma's Home / 外婆家 Đoạn Kiều",
    name: "外婆家(西湖断桥店)", zh: "杭州市西湖区北山路10号外婆家",
    img: "img/food-waipojia.jpg", lat: "30.259385", lng: "120.152510",
    amap: "https://www.amap.com/?p=B0KAFHC5Y9,30.259385,120.152510,%E5%A4%96%E5%A9%86%E5%AE%B6(%E8%A5%BF%E6%B9%96%E6%96%AD%E6%A1%A5%E5%BA%97),%E5%8C%97%E5%B1%B1%E8%A1%9710%E5%8F%B7",
    dishes: ["红烧肉 35", "龙井虾仁 40", "茶香鸡 35", "小笼包 10"]
  },
  xinzhouji: {
    group: "food", kind: "eat", area: "hz_qinghefang", k: "Trưa 09/01", vi: "Tân Châu Ký / 新周记 Cổ Lâu",
    name: "新周记·巷子里的江南味(鼓楼店)", zh: "杭州市上城区十五奎巷3号新周记",
    img: "img/food-xinzhouji.jpg", lat: "30.238027", lng: "120.170421",
    amap: "https://www.amap.com/?p=B0FFF4XZMX,30.238027,120.170421,%E6%96%B0%E5%91%A8%E8%AE%B0%C2%B7%E5%B7%B7%E5%AD%90%E9%87%8C%E7%9A%84%E6%B1%9F%E5%8D%97%E5%91%B3(%E9%BC%93%E6%A5%BC%E5%BA%97),%E5%8D%81%E4%BA%94%E5%A5%8E%E5%B7%B72-3%E5%8F%B7"
  },
  greentea: {
    group: "food", kind: "eat", area: "hz_hubin", k: "Tối 08/01", vi: "Green Tea / 绿茶 IN77",
    name: "绿茶餐厅(杭州湖滨in77店)", zh: "杭州市上城区延安路258号湖滨银泰IN77 C区三楼绿茶",
    img: "img/food-greentea.jpg", lat: "30.253246", lng: "120.165468",
    amap: "https://www.amap.com/?p=B0J09RYXWE,30.253246,120.165468,%E7%BB%BF%E8%8C%B6%E9%A4%90%E5%8E%85(%E6%9D%AD%E5%B7%9E%E6%B9%96%E6%BB%A8in77%E5%BA%97),%E5%BB%B6%E5%AE%89%E8%B7%AF258%E5%8F%B7%E6%B9%96%E6%BB%A8%E9%93%B6%E6%B3%B0in77C%E5%8C%BA%E4%B8%89%E6%A5%BC",
    dishes: ["绿茶烤鸡 45", "东坡肉 40", "石锅豆腐 30", "面包诱惑 25"]
  },
  butterful: {
    group: "food", kind: "eat", area: "hz_hubin", k: "Vặt Hồ Tân", vi: "黄油与面包 / Butterful IN77",
    name: "黄油与面包", zh: "杭州市上城区延安路239号湖滨银泰IN77黄油与面包",
    img: "img/food-greentea.jpg",
    dishes: ["Croissant ~26"]
  },
  chagee_hubin: {
    group: "food", kind: "drink", area: "hz_hubin", k: "Trà sữa 08–09/01", vi: "CHAGEE Hồ Tân",
    name: "霸王茶姬CHAGEE", zh: "杭州市上城区湖滨银泰in77霸王茶姬",
    img: "img/sight-qinghefang.jpg",
    dishes: ["伯牙绝弦 ~20"]
  },
  manner_dingan: {
    group: "food", kind: "drink", area: "hz_hubin", k: "Cà phê sáng", vi: "Manner Coffee gần Định An",
    name: "Manner Coffee", zh: "杭州市上城区定安路Manner咖啡",
    img: "img/sight-westlake.jpg",
    dishes: ["SOE Latte ~18"]
  },
  sanbao: {
    group: "food", kind: "eat", area: "hz_wulin", k: "Tối 09/01", vi: "Cua Tam Bảo / 蟹叁寳 Vũ Lâm",
    name: "蟹叁寳·蟹黄捞饭(杭州武林店)", zh: "杭州市拱墅区武林路129号蟹叁寳",
    img: "img/food-sanbao.jpg", lat: "30.260480", lng: "120.159890",
    amap: "https://www.amap.com/?p=B0J6SM1E1H,30.260480,120.159890,%E8%9F%B9%E5%8F%81%E5%AF%B3%C2%B7%E8%9F%B9%E9%BB%84%E6%8D%9E%E9%A5%AD(%E6%9D%AD%E5%B7%9E%E6%AD%A6%E6%9E%97%E5%BA%97),%E6%AD%A6%E6%9E%97%E8%B7%AF129%E5%8F%B7",
    dishes: ["蟹黄捞饭 / 面 88"]
  },
  dachafan: {
    group: "food", kind: "eat", area: "wz_xizha", k: "Tối 10/01", vi: "Dai Cha Fun — vịt quay",
    name: "大茶饭", zh: "浙江省桐乡市乌镇西栅大街612号大茶饭",
    img: "img/food-greentea.jpg",
    amap: "https://surl.amap.com/7vU4xfA1q8E7"
  },
  shusheng: {
    group: "food", kind: "eat", area: "wz_xizha", k: "Tối 10/01", vi: "Thư Sinh — mì cừu",
    name: "书生灯面", zh: "乌镇西栅大街216号书生灯面", img: "img/food-sanbao.jpg"
  },
  qiaoliqiao_tea: {
    group: "food", kind: "drink", area: "wz_xizha", k: "Trà Ô Trấn", vi: "Kiều Lý Kiều trà lâu tầng 2",
    name: "桥里桥茶楼", zh: "乌镇西栅桥里桥茶楼二楼",
    img: "img/sight-wuzhen.jpg",
    dishes: ["龙井 + 定胜糕 ~30/2"]
  },
  yuxingji: {
    group: "food", kind: "eat", area: "sh_bund", k: "Tối 11/01", vi: "Dụ Hưng Ký / 裕兴记 — cơm cua",
    name: "裕兴记·蟹黄面馆(外滩店)", zh: "上海市黄浦区四川中路410号裕兴记",
    img: "img/food-yuxingji.jpg", lat: "31.238965", lng: "121.487579",
    amap: "https://www.amap.com/?p=B0JUVH6ICN,31.238965,121.487579,%E8%A3%95%E5%85%B4%E8%AE%B0%C2%B7%E8%9F%B9%E9%BB%84%E9%9D%A2%E9%A6%86(%E5%A4%96%E6%BB%A9%E5%BA%97),%E5%9B%9B%E5%B7%9D%E4%B8%AD%E8%B7%AF410%E5%8F%B7",
    dishes: ["蟹粉饭", "蟹黄面 78 — chia đôi"]
  },
  shengjian: {
    group: "food", kind: "eat", area: "sh_bund", k: "Sáng 13/01", vi: "Tiểu Dương sinh tiễn",
    name: "小杨生煎(上海宁波路店)", zh: "上海市黄浦区宁波路178号小杨生煎",
    img: "img/food-shengjian.jpg", lat: "31.239273", lng: "121.483806",
    amap: "https://www.amap.com/?p=B00155HPX3,31.239273,121.483806,%E5%B0%8F%E6%9D%A8%E7%94%9F%E7%85%8E(%E4%B8%8A%E6%B5%B7%E5%AE%81%E6%B3%A2%E8%B7%AF%E5%BA%97),%E5%AE%81%E6%B3%A2%E8%B7%AF178%E5%8F%B7"
  },
  luckin_bund: {
    group: "food", kind: "drink", area: "sh_bund", k: "Sáng 12/01", vi: "Luckin gần khách sạn",
    name: "瑞幸咖啡Luckin", zh: "上海市黄浦区南京东路瑞幸咖啡",
    img: "img/sight-bund.jpg",
    dishes: ["Iced Latte"]
  },
  chagee_nanjing: {
    group: "food", kind: "drink", area: "sh_bund", k: "Vặt 11/01", vi: "CHAGEE Nam Kinh Đông",
    name: "霸王茶姬CHAGEE", zh: "上海市黄浦区南京东路霸王茶姬",
    img: "img/sight-bund.jpg",
    dishes: ["White Peach Oolong ~20"]
  },
  fuxiaoguan: {
    group: "food", kind: "eat", area: "sh_huanghe", k: "Đêm 12/01", vi: "Phú Tiểu Quán",
    name: "富小馆烧烤·牛腩煲(黄河路店)", zh: "上海市黄浦区黄河路85号富小馆",
    img: "img/food-fuxiaoguan.jpg", lat: "31.234983", lng: "121.471008",
    amap: "https://www.amap.com/?p=B0K0Y7GEVU,31.234983,121.471008,%E5%AF%8C%E5%B0%8F%E9%A6%86%E7%83%A7%E7%83%A4%C2%B7%E7%89%9B%E8%85%A9%E7%85%B2(%E9%BB%84%E6%B2%B3%E8%B7%AF%E5%BA%97),%E9%BB%84%E6%B2%B3%E8%B7%AF5-87%E5%8F%B7"
  },
  hanxiang: {
    group: "food", kind: "eat", area: "sh_wukang", k: "Trưa 13/01", vi: "Hãn Tường — mì lươn",
    name: "瀚祥本帮面馆", zh: "上海市徐汇区淮海中路1861号瀚祥本帮面馆", img: "img/food-sanbao.jpg"
  },
  linlee_yuyuan: {
    group: "food", kind: "drink", area: "sh_yuyuan", k: "Chiều 13/01", vi: "LINLEE / trà sữa Dự Viên",
    name: "LINLEE", zh: "上海市黄浦区豫园商城LINLEE",
    img: "img/sight-yuyuan.jpg",
    dishes: ["Lemon tea"]
  },
  chagee_pvg: {
    group: "food", kind: "drink", area: "sh_pvg", k: "Tối 13/01", vi: "CHAGEE sân bay Phố Đông T2",
    name: "霸王茶姬CHAGEE T2", zh: "上海浦东国际机场T2航站楼霸王茶姬",
    img: "img/transit-pvg.jpg",
    dishes: ["伯牙绝弦 — ly cuối"]
  }
};

var FOOD_AREAS = window.FOOD_AREAS = [
  { id: "hz_duanqiao", title: "Hồ Tây · Đoạn Kiều", sub: "Hàng Châu · trưa 08/01", open: true },
  { id: "hz_hubin", title: "Hồ Tân · IN77", sub: "Hàng Châu · tối 08/01 + trà/cà phê", open: true },
  { id: "hz_qinghefang", title: "Thanh Hà Phường · Cổ Lâu", sub: "Hàng Châu · trưa 09/01", open: false },
  { id: "hz_wulin", title: "Vũ Lâm", sub: "Hàng Châu · tối 09/01", open: false },
  { id: "wz_xizha", title: "Ô Trấn Tây Sách", sub: "Ăn tối + trà lâu 10/01", open: false },
  { id: "sh_bund", title: "Bund · Nam Kinh Đông", sub: "Thượng Hải · gần khách sạn", open: true },
  { id: "sh_huanghe", title: "Hoàng Hà Lộ", sub: "Sau Disney · đêm 12/01", open: false },
  { id: "sh_wukang", title: "Vũ Khang · An Phúc", sub: "Trưa 13/01", open: false },
  { id: "sh_yuyuan", title: "Dự Viên thương thành", sub: "Chiều–tối 13/01", open: false },
  { id: "sh_pvg", title: "Sân bay Phố Đông T2", sub: "Ly cuối trước giờ bay", open: false }
];

var FOOD = window.FOOD = [
  {
    city: "Hàng Châu 08/01", items: [
      ["Trưa", "外婆家", "红烧肉 / 龙井虾仁 / 茶香鸡", "Gọi 1 phần và cơm, đủ 2 người"],
      ["Vặt", "清河坊", "定胜糕 / 桂花糕 / 糖葫芦", "Ăn thử, đừng thay cơm"],
      ["Vặt", "黄油与面包 IN77", "Bánh bơ", "Hot, chỉ ăn vặt"],
      ["Tối", "绿茶 IN77", "绿茶烤鸡 / 东坡肉 / 面包诱惑", "Ngày mất ngủ — skip Vũ Lâm"]
    ]
  },
  {
    city: "Hàng Châu 09/01", items: [
      ["Sáng", "新丰小吃 / khách sạn", "小笼包 / 生煎", "Ngủ bù rồi ăn"],
      ["Trưa", "新周记", "东坡肉 / 油焖虾", "Cổ Lâu, gần 清河坊"],
      ["Trà", "佑圣观路 / CHAGEE", "龙井 / 伯牙绝弦", "Đừng mua trà phố cổ"],
      ["Tối", "蟹叁寳 Vũ Lâm", "蟹黄捞饭 / 面 88 tệ", "1 tô và xlb cho 2 người"]
    ]
  },
  {
    city: "Ô Trấn 10–11/01", items: [
      ["Vặt", "Tây Sách", "定胜糕 / 桥里桥烧饼 / 滋啦啦", "Ăn nóng. Bánh nướng hay limit 2 cái/người"],
      ["Tối", "大茶饭", "Vịt quay ~45 tệ", "1 phần 2 đứa"],
      ["Tối", "书生灯面", "Mì cừu ~35 tệ/tô", "Trời lạnh, 1 người 1 tô"],
      ["Trà", "Kiều Lý Kiều", "龙井 và 定胜糕", "Tầng 2 ngắm thuyền"],
      ["Sáng 11", "khách sạn / 早茶客", "Set 30 tệ", "07:00–09:30"]
    ]
  },
  {
    city: "Thượng Hải 11–13/01", items: [
      ["Tối 11", "裕兴记", "蟹粉饭 (ưu tiên) / 蟹黄面", "Đừng 2 tô mì full giá"],
      ["Sáng 12", "LUCKIN", "Iced Latte", "Trước Disney"],
      ["12", "Trong Disney", "Cơm park và kem Zootopia", "Đắt, mang snack"],
      ["Sáng 13", "小杨生煎", "生煎包", "Nên thử"],
      ["Trưa 13", "瀚祥", "Mì lươn", "Cạnh Vũ Khang"],
      ["Chiều 13", "Dự Viên", "南翔小笼 / thịt xiên / LINLEE", "Ghim cổng 5"],
      ["Tối 13", "CHAGEE sân bay Phố Đông, nhà ga 2", "伯牙绝弦", "Ly cuối"]
    ]
  }
];
