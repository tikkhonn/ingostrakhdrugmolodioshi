export type SeasonKey = 'winter' | 'spring' | 'summer' | 'autumn';

export interface SeasonCaseTemplate {
  caseTitle: string;
  text: string;
  insuranceCost: number;
  accidentCost: number;
  badLuckChance: number;
}

const P = 80;

export const seasonCasePools: Record<SeasonKey, SeasonCaseTemplate[]> = {
  winter: [
    {
      caseTitle: 'Перелом на лыжах',
      text:
        '❄️ На склоне вы не заметили ледяную корку, резко затормозили и получили перелом голеностопа. Скорая, рентген, гипс и реабилитация в частной клинике на курорте.',
      insuranceCost: 520,
      accidentCost: 9500,
      badLuckChance: P,
    },
    {
      caseTitle: 'Столкновение с другим лыжником',
      text:
        '❄️ На узкой трассе вас подрезали: столкновение на скорости, сотрясение и ушиб грудной клетки. Обследования, наблюдение и пропущенные дни на склоне превращаются в счёт.',
      insuranceCost: 480,
      accidentCost: 7200,
      badLuckChance: P,
    },
    {
      caseTitle: 'Травма на сноуборде',
      text:
        '❄️ Неудачное приземление после прыжка: вывих плеча и разрыв манжеты ротаторов. Операция и ортез — дорогая история зимой вдали от дома.',
      insuranceCost: 550,
      accidentCost: 11000,
      badLuckChance: P,
    },
    {
      caseTitle: 'Обморожение пальцев',
      text:
        '❄️ Долгий подъём на ветру без нормальных перчаток: обморожение кончиков пальцев. Срочная терапия, сосудистый хирург и восстановление чувствительности.',
      insuranceCost: 380,
      accidentCost: 4500,
      badLuckChance: P,
    },
    {
      caseTitle: 'Падение с подъёмника',
      text:
        '❄️ Резкая остановка канатной дороги: вы потеряли равновесие и ударились о опору. Травма головы, КТ, стационар на сутки.',
      insuranceCost: 500,
      accidentCost: 6800,
      badLuckChance: P,
    },
    {
      caseTitle: 'Телефон в снегу',
      text:
        '❄️ Смартфон выпал из кармана в рыхлый снег и промок. Новый аппарат того же класса + восстановление данных в сервисе.',
      insuranceCost: 220,
      accidentCost: 78000,
      badLuckChance: P,
    },
    {
      caseTitle: 'Кража лыж из камеры хранения',
      text:
        '❄️ В камере хранения вскрыли замок и унесли ваши лыжи и ботинки. Комплект на сезон приходится покупать заново по ценам курорта.',
      insuranceCost: 290,
      accidentCost: 55000,
      badLuckChance: P,
    },
    {
      caseTitle: 'Коньки: падение на катке',
      text:
        '❄️ На городском катке вас задел ребёнок на скорости: падение на лёд, перелом лучевой кости, наложение и контрольные снимки.',
      insuranceCost: 340,
      accidentCost: 3800,
      badLuckChance: P,
    },
    {
      caseTitle: 'Хоккей: травма лица',
      text:
        '❄️ На любительском матче шайба попала в незащищённую зону: сложное стоматологическое восстановление и швы.',
      insuranceCost: 410,
      accidentCost: 8500,
      badLuckChance: P,
    },
    {
      caseTitle: 'Санки: столкновение',
      text:
        '❄️ С горки на санках вы влетели в препятствие: ушиб позвоночника, МРТ и курс блокад с обезболиванием.',
      insuranceCost: 360,
      accidentCost: 5200,
      badLuckChance: P,
    },
    {
      caseTitle: 'Снежный ком с крыши',
      text:
        '❄️ С крыши сорвался снег: удар по плечу, растяжение и ушибы. Травмпункт, УЗИ сустава, физио.',
      insuranceCost: 310,
      accidentCost: 4100,
      badLuckChance: P,
    },
    {
      caseTitle: 'ДТП на заснеженной трассе',
      text:
        '❄️ Занос на зимней трассе: лёгкое столкновение, ремонт машины и ушиб шеи. Сервис, аренда авто на время ремонта, визит к неврологу.',
      insuranceCost: 450,
      accidentCost: 7800,
      badLuckChance: P,
    },
  ],

  spring: [
    {
      caseTitle: 'Падение с велика: сломан телефон',
      text:
        '🌸 На горной тропе вы вылетели через руль. Колени в ссадинах, а смартфон в кармане разбился — замена экрана не спасла, нужен новый телефон.',
      insuranceCost: 260,
      accidentCost: 65000,
      badLuckChance: P,
    },
    {
      caseTitle: 'Угон велосипеда',
      text:
        '🌸 Вы оставили велосипед у кафе на «минутку» без второго замка — его увезли. Покупка аналогичного МТБ и базовой экипировки.',
      insuranceCost: 320,
      accidentCost: 120000,
      badLuckChance: P,
    },
    {
      caseTitle: 'Сорванная связка на трейле',
      text:
        '🌸 Мокрый корень + тормоз: падение с разворотом колена. МРТ, ортопед, возможна артроскопия.',
      insuranceCost: 430,
      accidentCost: 9500,
      badLuckChance: P,
    },
    {
      caseTitle: 'Перелом запястья на мокром асфальте',
      text:
        '🌸 Велосипедист споткнулся о рельсы после дождя: перелом запястья, гипс, контроль у травматолога.',
      insuranceCost: 390,
      accidentCost: 5500,
      badLuckChance: P,
    },
    {
      caseTitle: 'Сильная аллергия, скорая',
      text:
        '🌸 Цветение + ветер: отёк гортани и вызов скорой. Стационар на ночь, гормональная терапия, наблюдение аллерголога.',
      insuranceCost: 350,
      accidentCost: 4800,
      badLuckChance: P,
    },
    {
      caseTitle: 'Поваленное дерево на дорожке',
      text:
        '🌸 После ветра ветка упала на вас во время пробежки: сотрясение, швы на коже, КТ.',
      insuranceCost: 400,
      accidentCost: 6200,
      badLuckChance: P,
    },
    {
      caseTitle: 'Электросамокат: падение на рельсах',
      text:
        '🌸 Занос на мокрых рельсах: падение на бок, ссадины и перелом ключицы. Операция с пластиной.',
      insuranceCost: 370,
      accidentCost: 8900,
      badLuckChance: P,
    },
    {
      caseTitle: 'Потеря ноутбука в парке',
      text:
        '🌸 Оставили рюкзак на лавке на секунду — его унесли. Ноутбук для работы и настройка с нуля.',
      insuranceCost: 280,
      accidentCost: 95000,
      badLuckChance: P,
    },
    {
      caseTitle: 'Укус клеща',
      text:
        '🌸 Клещ не заметили вовремя: лаборатории, прививки, курс антибиотиков и наблюдение инфекциониста.',
      insuranceCost: 300,
      accidentCost: 4200,
      badLuckChance: P,
    },
    {
      caseTitle: 'Град разбил стекло авто',
      text:
        '🌸 Внезапная гроза: лобовое в крошку, кузовные вмятины. Замена стёкол и покраска.',
      insuranceCost: 410,
      accidentCost: 7200,
      badLuckChance: P,
    },
    {
      caseTitle: 'Растяжение спины на даче',
      text:
        '🌸 Подняли тяжёлый мешок с землёй неправильно: протрузия обострилась, МРТ, блокады, ЛФК.',
      insuranceCost: 360,
      accidentCost: 5100,
      badLuckChance: P,
    },
    {
      caseTitle: 'Падение с лестницы в подъезде',
      text:
        '🌸 Мокрые ступени после уборки: падение, ушиб локтя и трещина в лучевой кости.',
      insuranceCost: 340,
      accidentCost: 4600,
      badLuckChance: P,
    },
  ],

  summer: [
    {
      caseTitle: 'Утопили телефон в воде',
      text:
        '☀️ На море телефон выпал из нагрудного кармана. Соль убила плату — новый флагман и перенос аккаунтов.',
      insuranceCost: 240,
      accidentCost: 88000,
      badLuckChance: P,
    },
    {
      caseTitle: 'Угон велосипеда с велопарковки',
      text:
        '☀️ Оставили велосипед у ТЦ на обрезанном замке — срезали и увезли. Замена велосипеда и замков.',
      insuranceCost: 310,
      accidentCost: 98000,
      badLuckChance: P,
    },
    {
      caseTitle: 'Сильный солнечный ожог',
      text:
        '☀️ На пляже без защиты получили ожоги II степени. Ожоговый центр, мази, перевязки, анализы.',
      insuranceCost: 330,
      accidentCost: 5400,
      badLuckChance: P,
    },
    {
      caseTitle: 'Самокат: падение без шлема',
      text:
        '☀️ Резкий поворот на скорости: падение, сотрясение, шов на брови и КТ.',
      insuranceCost: 380,
      accidentCost: 7600,
      badLuckChance: P,
    },
    {
      caseTitle: 'Пищевое отравление на шашлыках',
      text:
        '☀️ Недожаренное мясо: сильная интоксикация, капельницы в стационаре, анализы.',
      insuranceCost: 290,
      accidentCost: 3900,
      badLuckChance: P,
    },
    {
      caseTitle: 'Травма глаза на пляжном волейболе',
      text:
        '☀️ Мяч попал в глаз: осмотр офтальмохирурга, капли, контроль сетчатки.',
      insuranceCost: 350,
      accidentCost: 6700,
      badLuckChance: P,
    },
    {
      caseTitle: 'Мошенники сняли деньги с карты',
      text:
        '☀️ Скиммер на банкомате у пляжа: списали крупную сумму. Разбирательства с банком не всё покрыли — часть потерь на вас.',
      insuranceCost: 270,
      accidentCost: 45000,
      badLuckChance: P,
    },
    {
      caseTitle: 'Простуда от кондиционера',
      text:
        '☀️ Контраст жары и холода: тяжёлый бронхит, УЗИ, антибиотики и стационар на несколько дней.',
      insuranceCost: 320,
      accidentCost: 5800,
      badLuckChance: P,
    },
    {
      caseTitle: 'Падение с турника',
      text:
        '☀️ На уличной площадке сорвались руки: падение на спину, компрессионный перелом позвонка, корсет и реабилитация.',
      insuranceCost: 420,
      accidentCost: 10200,
      badLuckChance: P,
    },
    {
      caseTitle: 'Ожог от мангала',
      text:
        '☀️ Вспышка при розжиге: ожоги кистей и лица, срочная помощь и перевязки.',
      insuranceCost: 300,
      accidentCost: 4900,
      badLuckChance: P,
    },
    {
      caseTitle: 'Травма мениска в футболе',
      text:
        '☀️ Поворот колена на газоне: разрыв мениска, МРТ и операция.',
      insuranceCost: 440,
      accidentCost: 9200,
      badLuckChance: P,
    },
    {
      caseTitle: 'Удар электротранспорта о бордюр',
      text:
        '☀️ На электробайке задели высокий бордюр: падение, перелом кисти и ремонт транспорта.',
      insuranceCost: 360,
      accidentCost: 7100,
      badLuckChance: P,
    },
  ],

  autumn: [
    {
      caseTitle: 'Телефон разбился при падении в листве',
      text:
        '🍂 На мокрой дорожке поскользнулись: упали на смартфон в руке — разбитый экран и материнская плата, нужна замена.',
      insuranceCost: 250,
      accidentCost: 72000,
      badLuckChance: P,
    },
    {
      caseTitle: 'Угон велосипеда у подъезда',
      text:
        '🍂 Вечером оставили велик во дворе без сигнализации — утром место пустое. Покупка нового и замков.',
      insuranceCost: 300,
      accidentCost: 88000,
      badLuckChance: P,
    },
    {
      caseTitle: 'Простуда после ливня',
      text:
        '🍂 Промокли под дождём: через пару дней пневмония, рентген, антибиотики и больничный в платной клинике.',
      insuranceCost: 310,
      accidentCost: 5600,
      badLuckChance: P,
    },
    {
      caseTitle: 'Гололёд: перелом запястья',
      text:
        '🍂 На обледенелой плитке упали, опираясь на руку: перелом, гипс, контроль.',
      insuranceCost: 340,
      accidentCost: 4800,
      badLuckChance: P,
    },
    {
      caseTitle: 'Ветка упала на машину',
      text:
        '🍂 Сильный ветер: сухая ветка пробила лакокрасочное покрытие и повредила капот. Кузовной ремонт.',
      insuranceCost: 400,
      accidentCost: 6500,
      badLuckChance: P,
    },
    {
      caseTitle: 'Кража сумки в автобусе',
      text:
        '🍂 В час пик в толпе вытащили сумку: кошелёк, наушники и планшет. Восстановление документов и покупка техники.',
      insuranceCost: 280,
      accidentCost: 62000,
      badLuckChance: P,
    },
    {
      caseTitle: 'Самокат на мокрой брусчатке',
      text:
        '🍂 Занос на мокром камне: падение, ссадины и вывих плеча, рентген и фиксация.',
      insuranceCost: 350,
      accidentCost: 5900,
      badLuckChance: P,
    },
    {
      caseTitle: 'Обострение астмы на холоде',
      text:
        '🍂 Резкое похолодание: приступ, скорая, небулайзер, стационар и подбор терапии.',
      insuranceCost: 370,
      accidentCost: 5200,
      badLuckChance: P,
    },
    {
      caseTitle: 'Травма спины при уборке листвы',
      text:
        '🍂 Долго гнулись с граблями: протрузия, боль не проходит — МРТ, блокады, массажный курс.',
      insuranceCost: 360,
      accidentCost: 4700,
      badLuckChance: P,
    },
    {
      caseTitle: 'Ноутбук залило дождём в рюкзаке',
      text:
        '🍂 Молния на рюкзаке не застегнута — ливень залил ноутбук. Ремонт нецелесообразен, нужна замена.',
      insuranceCost: 290,
      accidentCost: 92000,
      badLuckChance: P,
    },
    {
      caseTitle: 'Падение с велосипеда на мокром листе',
      text:
        '🍂 Лист + влага = нулевое сцепление: падение, сотрясение и швы на подбородке.',
      insuranceCost: 380,
      accidentCost: 6800,
      badLuckChance: P,
    },
    {
      caseTitle: 'Опрокидывание на лестнице в подвал',
      text:
        '🍂 Скользкая ступенька: падение вниз, ушиб грудной клетки и перелом рёбер, обследования.',
      insuranceCost: 390,
      accidentCost: 7400,
      badLuckChance: P,
    },
  ],
};

for (const key of Object.keys(seasonCasePools) as SeasonKey[]) {
  const n = seasonCasePools[key].length;
  if (n !== 12) {
    throw new Error(`simulatorSeasonCases: ${key} must have 12 cases, got ${n}`);
  }
}
