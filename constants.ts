import { Week, Ticket, Track } from './types';

const IMAGE_WEEKS: Week[] = [
  {
    id: 1,
    title: "Неделя 1",
    subtitle: "Новички — простые датасеты, быстрые победы",
    competitions: [
      {
        day: 1,
        title: "Digit Recognizer (MNIST)",
        link: "https://www.kaggle.com/competitions/digit-recognizer",
        tasks: [
          { title: "Задача 1 (4ч)", description: "Самый простой пайплайн: Dataset/DataLoader → CNN → submit" },
          { title: "Задача 2 (4ч)", description: "Улучшение: аугментации + cosine LR + label smoothing" },
        ]
      },
      {
        day: 2,
        title: "Dogs vs Cats Redux",
        link: "https://www.kaggle.com/c/dogs-vs-cats-redux-kernels-edition",
        tasks: [
          { title: "Задача 1", description: "Transfer learning (ResNet18/EfficientNet-B0) + submit" },
          { title: "Задача 2", description: "Улучшение: fine-tune “разморозкой” слоёв + TTA (flip/crop)" },
        ]
      },
      {
        day: 3,
        title: "CIFAR-10",
        link: "https://www.kaggle.com/c/cifar-10",
        tasks: [
          { title: "Задача 1", description: "ResNet18/34 baseline + нормальная валидация" },
          { title: "Задача 2", description: "Улучшение: MixUp/CutMix + EMA/SWA (что успеете)" },
        ]
      },
      {
        day: 4,
        title: "Aerial Cactus Identification",
        link: "https://www.kaggle.com/c/aerial-cactus-identification",
        tasks: [
          { title: "Задача 1", description: "Простой pretrained backbone + submit" },
          { title: "Задача 2", description: "Улучшение: k-fold (хотя бы 3) или хотя бы CV-split + TTA" },
        ]
      },
      {
        day: 5,
        title: "Plant Seedlings Classification",
        link: "https://www.kaggle.com/competitions/plant-seedlings-classification",
        tasks: [
          { title: "Задача 1", description: "Baseline (EffNet-B0/ConvNeXt-T)" },
          { title: "Задача 2", description: "Улучшение: сильные аугментации (color jitter, blur, random crop) + баланс классов" },
        ]
      },
      {
        day: 6,
        title: "Kannada MNIST",
        link: "https://www.kaggle.com/competitions/Kannada-MNIST",
        tasks: [
          { title: "Задача 1", description: "Baseline + submit" },
          { title: "Задача 2", description: "Улучшение: error analysis (confusion matrix) → точечные аугментации под ошибки" },
        ]
      },
      {
        day: 7,
        title: "Leaf Classification",
        link: "https://www.kaggle.com/c/leaf-classification",
        tasks: [
          { title: "Задача 1", description: "“Табличный” бейзлайн на фичах + submit" },
          { title: "Задача 2", description: "Улучшение: бленд (модель по фичам + CNN по картинкам, если успеете)" },
        ]
      },
    ]
  },
  {
    id: 2,
    title: "Неделя 2",
    subtitle: "Средний уровень — мед/агро, дисбаланс, k-fold по-взрослому",
    competitions: [
      {
        day: 8,
        title: "Cassava Leaf Disease Classification",
        link: "https://www.kaggle.com/c/cassava-leaf-disease-classification",
        tasks: [
          { title: "Задача 1", description: "Stratified KFold + pretrained backbone" },
          { title: "Задача 2", description: "Улучшение: class weights / focal loss + TTA" },
        ]
      },
      {
        day: 9,
        title: "Paddy Doctor",
        link: "https://www.kaggle.com/competitions/paddy-disease-classification",
        tasks: [
          { title: "Задача 1", description: "Baseline + CV" },
          { title: "Задача 2", description: "Улучшение: использовать метаданные + сильные аугментации (Albumentations)" },
        ]
      },
      {
        day: 10,
        title: "Plant Pathology 2020",
        link: "https://www.kaggle.com/c/plant-pathology-2020-fgvc7",
        tasks: [
          { title: "Задача 1", description: "Baseline (часто multi-label) + правильная функция потерь" },
          { title: "Задача 2", description: "Улучшение: подбор thresholds по классам + macro-метрика" },
        ]
      },
      {
        day: 11,
        title: "Plant Pathology 2021",
        link: "https://www.kaggle.com/c/plant-pathology-2021-fgvc8",
        tasks: [
          { title: "Задача 1", description: "Baseline + CV" },
          { title: "Задача 2", description: "Улучшение: mixup/cutmix + label smoothing + TTA" },
        ]
      },
      {
        day: 12,
        title: "Histopathologic Cancer Detection",
        link: "https://www.kaggle.com/c/histopathologic-cancer-detection",
        tasks: [
          { title: "Задача 1", description: "Быстрый бейзлайн на патчах" },
          { title: "Задача 2", description: "Улучшение: stain/color аугментации + hard negative mining (упрощённо)" },
        ]
      },
      {
        day: 13,
        title: "SIIM-ISIC Melanoma",
        link: "https://www.kaggle.com/c/siim-isic-melanoma-classification",
        tasks: [
          { title: "Задача 1", description: "Baseline + метаданные пациента" },
          { title: "Задача 2", description: "Улучшение: patient-level CV (чтобы не было leakage) + калибровка вероятностей" },
        ]
      },
      {
        day: 14,
        title: "APTOS 2019 Blindness Detection",
        link: "https://www.kaggle.com/competitions/aptos2019-blindness-detection",
        tasks: [
          { title: "Задача 1", description: "Preprocessing (crop/resize/normalize) + baseline" },
          { title: "Задача 2", description: "Улучшение: ordinal-подход (если метрика вроде QWK) или class-balanced sampling" },
        ]
      },
    ]
  },
  {
    id: 3,
    title: "Неделя 3",
    subtitle: "Хардкор — multi-label, metric learning, длинный хвост, трюки",
    competitions: [
      {
        day: 15,
        title: "Human Protein Atlas",
        link: "https://www.kaggle.com/competitions/human-protein-atlas-image-classification",
        tasks: [
          { title: "Задача 1", description: "Multi-label baseline (BCEWithLogits)" },
          { title: "Задача 2", description: "Улучшение: class-wise thresholds + imbalance tricks (focal/pos_weight)" },
        ]
      },
      {
        day: 16,
        title: "Recursion Cellular Image Classification",
        link: "https://www.kaggle.com/competitions/recursion-cellular-image-classification",
        tasks: [
          { title: "Задача 1", description: "Baseline (часто лучше через embeddings/простую модель)" },
          { title: "Задача 2", description: "Улучшение: борьба с batch effects (по plate/site) + аккуратный CV" },
        ]
      },
      {
        day: 17,
        title: "iMet Collection 2019",
        link: "https://kaggle.com/competitions/imet-2019-fgvc6",
        tasks: [
          { title: "Задача 1", description: "Multi-label baseline" },
          { title: "Задача 2", description: "Улучшение: подбор thresholds + oversampling редких классов" },
        ]
      },
      {
        day: 18,
        title: "Google Landmark Recognition 2021",
        link: "https://www.kaggle.com/competitions/landmark-recognition-2021",
        tasks: [
          { title: "Задача 1", description: "Быстрый baseline (даже на subset)" },
          { title: "Задача 2", description: "Улучшение: metric-learning/ArcFace или kNN поверх embeddings" },
        ]
      },
      {
        day: 19,
        title: "Happywhale (ID-рекогнишн)",
        link: "https://www.kaggle.com/competitions/happy-whale-and-dolphin",
        tasks: [
          { title: "Задача 1", description: "Embeddings + nearest neighbors" },
          { title: "Задача 2", description: "Улучшение: ArcFace + re-ranking (если успеете)" },
        ]
      },
      {
        day: 20,
        title: "Humpback Whale Identification",
        link: "https://www.kaggle.com/c/humpback-whale-identification",
        tasks: [
          { title: "Задача 1", description: "Baseline + аккуратный препроцесс (crop хвоста)" },
          { title: "Задача 2", description: "Улучшение: triplet/contrastive + сильный sampler" },
        ]
      },
      {
        day: 21,
        title: "Shopee Product Matching",
        link: "https://www.kaggle.com/c/shopee-product-matching/data",
        tasks: [
          { title: "Задача 1", description: "Image embeddings + similarity threshold" },
          { title: "Задача 2", description: "Улучшение: добавить текст/мультимодал (если хотите) + калибровка порога на CV" },
        ]
      },
    ]
  }
];

const AUDIO_WEEKS: Week[] = [
  {
    id: 1,
    title: "Неделя 1",
    subtitle: "Новички — фичи, пайплайн, базовые модели",
    competitions: [
      {
        day: 1,
        title: "TF Speech Recognition (Keyword Spotting)",
        link: "https://www.kaggle.com/c/tensorflow-speech-recognition-challenge",
        tasks: [
          { title: "Суть", description: "Классификация очень коротких команд (“yes/no/up/…”), обычно 1 сек." },
          { title: "Особенности", description: "Классы “silence/unknown”, аккуратная нарезка и нормализация громкости важнее “супермодели”." },
          { title: "Натренирует", description: "End-to-end пайплайн аудио→фичи→CNN, handling спец-классов, чистая валидация." }
        ]
      },
      {
        day: 2,
        title: "TUT Acoustic Scene Classification",
        link: "https://www.kaggle.com/competitions/acoustic-scene-2018",
        tasks: [
          { title: "Суть", description: "Распознавание “сцены” (улица, метро, парк и т.п.) по аудио." },
          { title: "Особенности", description: "Доменный сдвиг (город/устройство записи), легко “переобучиться на шумы”." },
          { title: "Натренирует", description: "Устойчивость к доменам, правильный CV, понимание “что модель реально учит”." }
        ]
      },
      {
        day: 3,
        title: "Freesound General-Purpose Audio Tagging",
        link: "https://kaggle.com/c/freesound-audio-tagging",
        tasks: [
          { title: "Суть", description: "“Угадай тип звука” из реального мира (audio tagging)." },
          { title: "Особенности", description: "Очень разнородные классы/условия записи → решает хороший препроцесс + аугментации." },
          { title: "Натренирует", description: "Базовую аудио-классификацию на шумных данных, SpecAugment/MixUp на спектрограммах." }
        ]
      },
      {
        day: 4,
        title: "Speech Recognition (DTW2)",
        link: "https://www.kaggle.com/competitions/dtw2",
        tasks: [
          { title: "Суть", description: "Распознавание (часто цифр) через Dynamic Time Warping (классика, “до нейросетей”)." },
          { title: "Особенности", description: "Важно выбрать признаки (MFCC/лог-мел) и метрику/нормализацию; сеть может даже не понадобиться." },
          { title: "Натренирует", description: "Baseline-мышление, фичи/метрики, sanity-check’и и интерпретируемые решения." }
        ]
      },
      {
        day: 5,
        title: "Speaker Identification",
        link: "https://www.kaggle.com/competitions/speaker-identification/overview",
        tasks: [
          { title: "Суть", description: "Определить, кто говорит (классификация диктора)." },
          { title: "Особенности", description: "Утечки через сплит (один и тот же спикер/запись в train/val) убивают честность результата." },
          { title: "Натренирует", description: "Правильные сплиты “по сущности” (speaker-wise), эмбеддинги/спикер-фичи, матрица ошибок." }
        ]
      },
      {
        day: 6,
        title: "Sound of Nature | AICC Round 3",
        link: "https://www.kaggle.com/competitions/sound-of-nature-aicc-round-3",
        tasks: [
          { title: "Суть", description: "Классификация природных звуков (биоакустика/окружение)." },
          { title: "Особенности", description: "Фон/шумы и редкие классы — типичная реальность; полезны балансировка и robust-аугменты." },
          { title: "Натренирует", description: "Работу с “грязными” природными записями, борьбу с дисбалансом." }
        ]
      },
      {
        day: 7,
        title: "Person Identification Using Speech",
        link: "https://www.kaggle.com/competitions/person-identification-using-speech-recognition",
        tasks: [
          { title: "Суть", description: "Идентификация личности по речи/аудио." },
          { title: "Особенности", description: "Качество сегментации и стабильные фичи часто решают больше, чем выбор “модной” сети." },
          { title: "Натренирует", description: "Отличать “контент” от “артефактов записи”, делать устойчивые пайплайны." }
        ]
      },
    ]
  },
  {
    id: 2,
    title: "Неделя 2",
    subtitle: "Средний уровень — длинные записи, слабые лейблы",
    competitions: [
      {
        day: 8,
        title: "Freesound Audio Tagging 2019",
        link: "https://www.kaggle.com/c/freesound-audio-tagging-2019",
        tasks: [
          { title: "Суть", description: "Multi-label tagging (в клипе может быть несколько звуков) + шумные/неполные лейблы." },
          { title: "Особенности", description: "Пороги по классам критичны; “0.5 для всех” почти всегда плохо." },
          { title: "Натренирует", description: "Multi-label, thresholding, борьбу с noisy labels, аккуратный CV." }
        ]
      },
      {
        day: 9,
        title: "Rainforest Connection Species (RFCx)",
        link: "https://www.kaggle.com/competitions/rfcx-species-audio-detection",
        tasks: [
          { title: "Суть", description: "Предсказать вероятности видов (птицы/лягушки) в саундскейпах." },
          { title: "Особенности", description: "Длинные записи → решают windowing + агрегация; много фоновых звуков." },
          { title: "Натренирует", description: "SED-подобное мышление (окна/агрегация), постпроцессинг по времени." }
        ]
      },
      {
        day: 10,
        title: "Cornell Birdcall Identification",
        link: "https://www.kaggle.com/competitions/birdsong-recognition",
        tasks: [
          { title: "Суть", description: "Слабые лейблы в длинных записях: “где-то тут есть этот вид”." },
          { title: "Особенности", description: "Слабая разметка → нужно аккуратно выбирать окна, hard negatives, и не верить “идеальности” train." },
          { title: "Натренирует", description: "Weak supervision, стратегии сэмплирования по времени, устойчивый инференс." }
        ]
      },
      {
        day: 11,
        title: "BirdCLEF 2021",
        link: "https://www.kaggle.com/competitions/birdclef-2021",
        tasks: [
          { title: "Суть", description: "Определение видов птиц по звуку в саундскейпах." },
          { title: "Особенности", description: "Доменный сдвиг между train/test (контекст записи отличается)." },
          { title: "Натренирует", description: "Domain robustness, сильный препроцесс, стабильный CV." }
        ]
      },
      {
        day: 12,
        title: "BirdCLEF 2022",
        link: "https://www.kaggle.com/competitions/birdclef-2022",
        tasks: [
          { title: "Суть", description: "Саундскейпы + ограниченные данные по редким видам." },
          { title: "Особенности", description: "Long-tail и scarcity: классические трюки (балансировка/аугменты) дают большой прирост." },
          { title: "Натренирует", description: "Работа с редкими классами, калибровка, careful ensembling (если успеваете)." }
        ]
      },
      {
        day: 13,
        title: "DCASE2019 Task 1B",
        link: "https://www.kaggle.com/competitions/dcase2019-task1b-leaderboard",
        tasks: [
          { title: "Суть", description: "Acoustic scene classification при несовпадении устройств записи (mismatched devices)." },
          { title: "Особенности", description: "Модель легко “узнаёт микрофон”, а не сцену — нужна нормализация/устойчивость." },
          { title: "Натренирует", description: "Анти-спуриюсные приёмы, device-robust CV, диагностика доменного сдвига." }
        ]
      },
      {
        day: 14,
        title: "ML Olympiad – Dialect Recognition",
        link: "https://www.kaggle.com/competitions/ml-olympiad-dialectrecognition",
        tasks: [
          { title: "Суть", description: "Определение диалекта по речи (speech classification)." },
          { title: "Особенности", description: "Часто важны speaker-wise сплиты и noise-robust подход; можно делать аудио-only, без текста." },
          { title: "Натренирует", description: "Speech-классификация “в реальном мире”, аккуратные разбиения, устойчивость к шуму." }
        ]
      },
    ]
  },
  {
    id: 3,
    title: "Неделя 3",
    subtitle: "Хардкор — постпроцессинг, псевдолейблы, мультимодал",
    competitions: [
      {
        day: 15,
        title: "BirdCLEF 2023",
        link: "https://www.kaggle.com/competitions/birdclef-2023",
        tasks: [
          { title: "Суть", description: "Идентификация восточноафриканских видов по аудио." },
          { title: "Особенности", description: "Много похожих классов + фон → решают инференс-стратегии и тонкая настройка." },
          { title: "Натренирует", description: "“Соревновательный” инференс (TTA по времени, агрегация), борьбу с близкими классами." }
        ]
      },
      {
        day: 16,
        title: "BirdCLEF 2024",
        link: "https://www.kaggle.com/competitions/birdclef-2024",
        tasks: [
          { title: "Суть", description: "Виды по аудио, фокус на малоизученных видах." },
          { title: "Особенности", description: "Слабые/шумные сценарии записи → постпроцессинг и пороги по классам решают." },
          { title: "Натренирует", description: "Мощный постпроцесс, per-class calibration, устойчивость к реальному шуму." }
        ]
      },
      {
        day: 17,
        title: "BirdCLEF+ 2025",
        link: "https://www.kaggle.com/competitions/birdclef-2025",
        tasks: [
          { title: "Суть", description: "Species ID по аудио (птицы/амфибии/млекопитающие/насекомые)." },
          { title: "Особенности", description: "Максимально “дикий” датасет + большой простор для псевдолейблинга/ансамблей (аккуратно!)." },
          { title: "Натренирует", description: "Near-SOTA пайплайн биоакустики: калибровка, PL-идеи, ансамблирование." }
        ]
      },
      {
        day: 18,
        title: "Underwater acoustic modulation",
        link: "https://www.kaggle.com/competitions/underwater-acoustic-signal-modulation-recognition",
        tasks: [
          { title: "Суть", description: "Классификация типа модуляции по подводному сигналу (не речь, а связь)." },
          { title: "Особенности", description: "Иногда лучше работают 1D-модели/спец-фичи; спектрограмма ≠ всегда лучший вариант." },
          { title: "Натренирует", description: "“Аудио не-музыка/не-речь”, выбор представления (raw/FFT/STFT), инженерный подход." }
        ]
      },
      {
        day: 19,
        title: "CI-AVSR (Cantonese Audio-Visual)",
        link: "https://www.kaggle.com/competitions/ci-avsr",
        tasks: [
          { title: "Суть", description: "Распознавание команд в машине, мультимодал (аудио+видео)." },
          { title: "Особенности", description: "Можно сделать аудио-only baseline, а потом сравнить с late-fusion; данные маленькие." },
          { title: "Натренирует", description: "Fusion-мышление (даже если вы оставите только аудио), аккуратное обучение на маленьких датасетах." }
        ]
      },
      {
        day: 20,
        title: "Track 2: Audio Identification Quest",
        link: "https://kaggle.com/competitions/track-2-audio-identification-quest",
        tasks: [
          { title: "Суть", description: "Классификация аудио по возрастным группам и полу (voice biometrics)." },
          { title: "Особенности", description: "Сильные “shortcut’ы” (качество микрофона/шумы) → нужна устойчивость и честный CV." },
          { title: "Натренирует", description: "Прикладную биометрику, анти-утечки, robust preprocessing." }
        ]
      },
      {
        day: 21,
        title: "HCU Speech Recognition Challenge 2025",
        link: "https://www.kaggle.com/competitions/hcu-speech-recognition-challenge-2025",
        tasks: [
          { title: "Суть", description: "Автоматическое распознавание речи (speech-to-text)." },
          { title: "Особенности", description: "Это уже ASR, другая лига: метрика типа WER, декодинг/CTC/seq2seq (зависит от формата)." },
          { title: "Натренирует", description: "Переход от “классификации” к “последовательностям”, понимание декодинга и ошибок распознавания." }
        ]
      },
    ]
  }
];

const DETECTION_WEEKS: Week[] = [
  {
    id: 1,
    title: "Неделя 1",
    subtitle: "Базовая bbox-детекция — пайплайн, IoU/mAP, NMS",
    competitions: [
      {
        day: 1,
        title: "Global Wheat Detection",
        link: "https://www.kaggle.com/competitions/global-wheat-detection",
        tasks: [
          { title: "Суть", description: "Найти колосья на полевых фото (bbox)." },
          { title: "Особенности", description: "Много мелких объектов и важность правильного NMS/порогов." },
          { title: "Натренирует", description: "Small-object детекцию, стабильный инференс." }
        ]
      },
      {
        day: 2,
        title: "TF - Great Barrier Reef",
        link: "https://www.kaggle.com/competitions/tensorflow-great-barrier-reef",
        tasks: [
          { title: "Суть", description: "Детекция COTS (морские звёзды) на подводных кадрах/видео." },
          { title: "Особенности", description: "“Грязная” картинка + motion blur." },
          { title: "Натренирует", description: "Детекцию на шумных доменах, video-wise сплиты." }
        ]
      },
      {
        day: 3,
        title: "Cars Object Detection",
        link: "https://www.kaggle.com/competitions/cars-object-detection",
        tasks: [
          { title: "Суть", description: "Классическая bbox-детекция машин." },
          { title: "Особенности", description: "Быстрый старт, удобно отточить форматы и дебаг боксов." },
          { title: "Натренирует", description: "Базовый end-to-end детекторный пайплайн." }
        ]
      },
      {
        day: 4,
        title: "Tom & Jerry Object Detection",
        link: "https://www.kaggle.com/competitions/tom-jerry-object-detection",
        tasks: [
          { title: "Суть", description: "Bbox на мульт-домене." },
          { title: "Особенности", description: "Доменный сдвиг, легко “учить контуры/фон”." },
          { title: "Натренирует", description: "Устойчивость и адекватные аугментации." }
        ]
      },
      {
        day: 5,
        title: "2024 DataLab Cup 2",
        link: "https://kaggle.com/competitions/2024-datalab-cup2",
        tasks: [
          { title: "Суть", description: "Bbox на учебном датасете." },
          { title: "Особенности", description: "Много типичных ошибок формата/координат." },
          { title: "Натренирует", description: "Дисциплину “данные→модель→сабмит” без фейлов." }
        ]
      },
      {
        day: 6,
        title: "A0-2025 Object Detection",
        link: "https://kaggle.com/competitions/a0-2025-object-detection",
        tasks: [
          { title: "Суть", description: "Детекция фруктов/объектов (bbox)." },
          { title: "Особенности", description: "Обычно простая структура, можно быстро сравнивать трюки." },
          { title: "Натренирует", description: "Быстрые итерации и аккуратный CV." }
        ]
      },
      {
        day: 7,
        title: "Few-shot object detection",
        link: "https://www.kaggle.com/competitions/few-shot-object-detection",
        tasks: [
          { title: "Суть", description: "Локализация при малом числе примеров." },
          { title: "Особенности", description: "Мало данных → важны заморозка/регуляризация/аугменты." },
          { title: "Натренирует", description: "Few-shot мышление и “не переобучиться”." }
        ]
      },
    ]
  },
  {
    id: 2,
    title: "Неделя 2",
    subtitle: "“Реальный мир” — synthetic→real, multi-class, медицина",
    competitions: [
      {
        day: 8,
        title: "Synthetic to Real Challenge",
        link: "https://www.kaggle.com/competitions/synthetic-2-real-object-detection-challenge",
        tasks: [
          { title: "Суть", description: "Учимся на синтетике, тест на реале." },
          { title: "Особенности", description: "Domain gap — главный враг." },
          { title: "Натренирует", description: "Robustness и доменные аугменты." }
        ]
      },
      {
        day: 9,
        title: "Synthetic 2 Real Challenge 2",
        link: "https://www.kaggle.com/competitions/synthetic-2-real-object-detection-challenge-2",
        tasks: [
          { title: "Суть", description: "Та же идея, другой раунд." },
          { title: "Особенности", description: "“Модель сильнее” не всегда решает; решают данные/симуляция." },
          { title: "Натренирует", description: "Data-centric подход." }
        ]
      },
      {
        day: 10,
        title: "Multi-Instance Detection",
        link: "https://www.kaggle.com/competitions/multi-instance-object-detection-challenge/data",
        tasks: [
          { title: "Суть", description: "Synthetic→real, много объектов на картинке." },
          { title: "Особенности", description: "Постпроцесс (NMS/thresholds) реально влияет." },
          { title: "Натренирует", description: "Уверенный инференс и отладку ошибок боксов." }
        ]
      },
      {
        day: 11,
        title: "Multi-class Object Detection",
        link: "https://www.kaggle.com/competitions/multi-class-object-detection-challenge",
        tasks: [
          { title: "Суть", description: "Synthetic→real, несколько классов." },
          { title: "Особенности", description: "Per-class thresholds/NMS, перекос по классам." },
          { title: "Натренирует", description: "Multi-class детекцию и калибровку." }
        ]
      },
      {
        day: 12,
        title: "RSNA Pneumonia Detection",
        link: "https://www.kaggle.com/c/rsna-pneumonia-detection-challenge",
        tasks: [
          { title: "Суть", description: "Локализовать пневмонию на рентгене (bbox)." },
          { title: "Особенности", description: "DICOM, patient-wise сплиты важны." },
          { title: "Натренирует", description: "Мед-детекцию и аккуратную валидацию." }
        ]
      },
      {
        day: 13,
        title: "SIIM-FISABIO-RSNA COVID-19",
        link: "https://www.kaggle.com/c/siim-covid19-detection",
        tasks: [
          { title: "Суть", description: "Детекция/локализация COVID-паттернов (bbox + классы)." },
          { title: "Особенности", description: "Многоуровневая логика, пороги сильно решают." },
          { title: "Натренирует", description: "Multi-task сборку пайплайна и калибровку confidence." }
        ]
      },
      {
        day: 14,
        title: "VinBigData Chest X-ray",
        link: "https://www.kaggle.com/competitions/vinbigdata-chest-xray-abnormalities-detection",
        tasks: [
          { title: "Суть", description: "Multi-class bbox по аномалиям на X-ray." },
          { title: "Особенности", description: "Много классов + сложные боксы." },
          { title: "Натренирует", description: "Multi-class детекцию “по-взрослому”, per-class postprocess." }
        ]
      },
    ]
  },
  {
    id: 3,
    title: "Неделя 3",
    subtitle: "Локализация через маски — хардкорный детекторный навык",
    competitions: [
      {
        day: 15,
        title: "Airbus Ship Detection",
        link: "https://www.kaggle.com/competitions/airbus-ship-detection",
        tasks: [
          { title: "Суть", description: "Найти корабли на спутниковых снимках (маски)." },
          { title: "Особенности", description: "Много пустых кадров, мелкие объекты." },
          { title: "Натренирует", description: "Satellite-локализацию и фильтрацию ложняков." }
        ]
      },
      {
        day: 16,
        title: "Severstal: Steel Defect",
        link: "https://www.kaggle.com/c/severstal-steel-defect-detection",
        tasks: [
          { title: "Суть", description: "Локализовать дефекты на стали (маски/классы)." },
          { title: "Особенности", description: "Сильный дисбаланс и “тонкие” дефекты." },
          { title: "Натренирует", description: "Industrial inspection и работу с long-tail." }
        ]
      },
      {
        day: 17,
        title: "SIIM-ACR Pneumothorax",
        link: "https://kaggle.com/competitions/siim-acr-pneumothorax-segmentation",
        tasks: [
          { title: "Суть", description: "Классифицировать и, если есть, сегментировать пневмоторакс." },
          { title: "Особенности", description: "Медицинский домен + аккуратный препроцесс." },
          { title: "Натренирует", description: "“bbox ↔ mask” мышление и мед-pipeline." }
        ]
      },
      {
        day: 18,
        title: "Sartorius – Cell Instance",
        link: "https://www.kaggle.com/competitions/sartorius-cell-instance-segmentation",
        tasks: [
          { title: "Суть", description: "Найти отдельные клетки (instance)." },
          { title: "Особенности", description: "“Слипшиеся” объекты → нужен грамотный postprocess." },
          { title: "Натренирует", description: "Instance-level локализацию и разделение объектов." }
        ]
      },
      {
        day: 19,
        title: "2018 Data Science Bowl",
        link: "https://www.kaggle.com/c/data-science-bowl-2018",
        tasks: [
          { title: "Суть", description: "Сегментация ядер в разных условиях." },
          { title: "Особенности", description: "Огромная вариативность доменов." },
          { title: "Натренирует", description: "Обобщение, сильные аугменты, устойчивость." }
        ]
      },
      {
        day: 20,
        title: "TGS Salt Identification",
        link: "https://www.kaggle.com/competitions/tgs-salt-identification-challenge",
        tasks: [
          { title: "Суть", description: "Сегментация соли на сейсмике." },
          { title: "Особенности", description: "Необычная текстура/геометрия данных." },
          { title: "Натренирует", description: "“Детекция на не-фото” и умение не ломаться на странных доменах." }
        ]
      },
      {
        day: 21,
        title: "UW-Madison GI Tract",
        link: "https://www.kaggle.com/competitions/uw-madison-gi-tract-image-segmentation",
        tasks: [
          { title: "Суть", description: "Сегментация органов на МРТ." },
          { title: "Особенности", description: "Много срезов/пациентов, важно групповое CV." },
          { title: "Натренирует", description: "Мед-сегментацию, patient-wise валидацию, стабильный пайплайн." }
        ]
      },
    ]
  }
];

const SEGMENTATION_WEEKS: Week[] = [
  {
    id: 1,
    title: "Неделя 1",
    subtitle: "Новички — база semantic segmentation, формат сабмита",
    competitions: [
      {
        day: 1,
        title: "Carvana & TGS Salt",
        link: "https://www.kaggle.com/c/carvana-image-masking-challenge",
        tasks: [
          { title: "Carvana (4ч)", description: "Бинарная маска “авто vs фон”. U-Net, Dice/IoU, базовый инференс." },
          { title: "TGS Salt (4ч)", description: "Маленькие изображения. Порогование, IoU-метрика, простая TTA." },
        ]
      },
      {
        day: 2,
        title: "Road Segmentation (EPFL & CIL)",
        link: "https://www.kaggle.com/competitions/epfml17-segmentation",
        tasks: [
          { title: "EPFL Road (4ч)", description: "Спутниковые снимки. Loss-балансировка (Dice+BCE), работа с тонкими масками." },
          { title: "CIL Road (4ч)", description: "Устойчивость к domain shift. Датасет-основа для своих мини-сорев." },
        ]
      },
      {
        day: 3,
        title: "Medical: Nerve & Pneumothorax",
        link: "https://www.kaggle.com/c/ultrasound-nerve-segmentation",
        tasks: [
          { title: "Ultrasound Nerve", description: "Нервы на УЗИ. Нормализация, усиленные аугментации, постпроцессинг." },
          { title: "SIIM Pneumothorax", description: "Пневмоторакс. Обработка “no finding” (пустых масок), RLE encode/decode." },
        ]
      },
      {
        day: 4,
        title: "Intro & Game: Brain MRI & Lethal Company",
        link: "https://kaggle.com/competitions/kma-intro-to-dl",
        tasks: [
          { title: "KMA Brain MRI", description: "Компактный учебный датасет. Быстрый baseline, valid split, sanity-checks." },
          { title: "Lethal Company", description: "Игровой/синтетический домен. Robustness, feature-engineering в препроцессе." },
        ]
      },
      {
        day: 5,
        title: "Clouds & Ships (Multi-label/Empty)",
        link: "https://www.kaggle.com/c/understanding_cloud_organization/data",
        tasks: [
          { title: "Understanding Clouds", description: "4 класса облаков (multi-label). Per-class threshold, стратификация." },
          { title: "Airbus Ship", description: "Корабли, много пустых кадров. Дисбаланс, маленькие объекты." },
        ]
      },
      {
        day: 6,
        title: "Steel & Roads (Multiclass/Educational)",
        link: "https://www.kaggle.com/c/severstal-steel-defect-detection/data",
        tasks: [
          { title: "Severstal Steel", description: "Дефекты стали. Жёсткий дисбаланс, sampling/weights, стабильные лоссы." },
          { title: "YSDA Road", description: "Учебный формат. Чистый training loop, быстрые эксперименты." },
        ]
      },
      {
        day: 7,
        title: "Speedrun: Carvana & TGS Engineering",
        link: "https://www.kaggle.com/c/carvana-image-masking-challenge",
        tasks: [
          { title: "Carvana Speedrun", description: "Цель: максимум качества без усложнений. Быстрый “production-like” пайплайн." },
          { title: "TGS Salt Engineering", description: "Цель: выжать score. Правильный CV, tuning threshold, TTA." },
        ]
      },
    ]
  },
  {
    id: 2,
    title: "Неделя 2",
    subtitle: "Middle — instance, тайлинг, нестандартные данные",
    competitions: [
      {
        day: 8,
        title: "Instance: Nuclei & Cells",
        link: "https://www.kaggle.com/competitions/data-science-bowl-2018/data",
        tasks: [
          { title: "DS Bowl 2018", description: "Ядра клеток. Instance→mask логика, connected components, постпроцессинг." },
          { title: "Sartorius Cell", description: "Нейрональные клетки. Обработка RLE, instance-метрики." },
        ]
      },
      {
        day: 9,
        title: "WSI: Kidney & Organ",
        link: "https://www.kaggle.com/competitions/hubmap-kidney-segmentation",
        tasks: [
          { title: "HuBMAP Kidney", description: "Гломерулы на WSI. Patch-training, stitch-inference, memory-экономия." },
          { title: "HuBMAP Organ", description: "Разные органы. Multi-domain segmentation, грамотный split." },
        ]
      },
      {
        day: 10,
        title: "3D/Temporal: GI Tract & Contrails",
        link: "https://www.kaggle.com/competitions/uw-madison-gi-tract-image-segmentation",
        tasks: [
          { title: "UW-Madison GI", description: "16-bit изображения, сложная геометрия. 2.5D идеи, правильный resize." },
          { title: "Identify Contrails", description: "Временной контекст. 2.5D/temporal входы, аккуратный dataloader." },
        ]
      },
      {
        day: 11,
        title: "Multispectral & Large Scale",
        link: "https://www.kaggle.com/c/dstl-satellite-imagery-feature-detection",
        tasks: [
          { title: "Dstl Satellite", description: "Мультиспектральные (каналы ≠ RGB). Индексы/нормализация, multi-class IoU." },
          { title: "Open Images 2019", description: "Огромный датасет (subset). Instance-pipeline, data engineering." },
        ]
      },
      {
        day: 12,
        title: "Fine-grained: Fashion & Log Face",
        link: "https://www.kaggle.com/c/imaterialist-fashion-2019-FGVC6",
        tasks: [
          { title: "iMaterialist Fashion", description: "Одежда. Точность границ, multi-scale, аккуратный augment." },
          { title: "Log Face", description: "Похожие объекты. Watershed/CC постпроцессинг, instance-метрики." },
        ]
      },
      {
        day: 13,
        title: "Full Scale: Severstal & Clouds",
        link: "https://www.kaggle.com/c/severstal-steel-defect-detection/data",
        tasks: [
          { title: "Severstal (Full)", description: "Все классы. Multi-label heads, class-wise tuning, hard mining." },
          { title: "Understanding Clouds", description: "Все классы. Multi-label inference, стабильные сабмиты (RLE)." },
        ]
      },
      {
        day: 14,
        title: "Instance & Boundary: Airbus & EPFL",
        link: "https://www.kaggle.com/competitions/airbus-ship-detection",
        tasks: [
          { title: "Airbus Instance", description: "Mask R-CNN/SoloV2 подход. Instance segmentation и postproc по объектам." },
          { title: "EPFL Boundary", description: "Упор на края. Boundary loss/aux head, CRF/морфология." },
        ]
      },
    ]
  },
  {
    id: 3,
    title: "Неделя 3",
    subtitle: "Хардкор — 3D/видео/жёсткие ограничения",
    competitions: [
      {
        day: 15,
        title: "Constraints: Cuties (CLIP-only)",
        link: "https://www.kaggle.com/code/cyprusaitraining/baseline-cuties-segmentation",
        tasks: [
          { title: "Cuties (CLIP-only)", description: "Запрет pretrained кроме CLIP. Prompt-engineering, zero/few-shot сегментация." },
          { title: "Cuties (Patch-feats)", description: "Упор на patch embeddings + постпроцессинг масок (CC, smoothing)." },
        ]
      },
      {
        day: 16,
        title: "Vesuvius: Ink & Surface",
        link: "https://github.com/association-rosia/vesuvius-challenge",
        tasks: [
          { title: "Ink Detection", description: "3D X-ray to 2D mask. 2.5D/3D U-Net, тайлинг по depth." },
          { title: "Surface Detection", description: "Виртуальное разворачивание. Геометрия/3D-контекст, инженерный пайплайн." },
        ]
      },
      {
        day: 17,
        title: "3D High-Res: Blood Vessel & GI Tract",
        link: "https://www.kaggle.com/competitions/blood-vessel-segmentation",
        tasks: [
          { title: "SenNet Blood Vessel", description: "Реально 3D и high-res. Chunking, memory tricks, 3D постпроцессинг." },
          { title: "UW-Madison (2.5D)", description: "Контекст соседних срезов. 2.5D batching, стабильность на мед-данных." },
        ]
      },
      {
        day: 18,
        title: "Video & Spectral: CVPR Driving & Dstl",
        link: "https://www.kaggle.com/competitions/cvpr-2018-autonomous-driving",
        tasks: [
          { title: "CVPR Video Seg", description: "Сегментация по видео. Video-aware инференс, flow-идея, трекинг." },
          { title: "Dstl (Full Spectral)", description: "Использование всех 16 каналов. Грамотный feature stacking." },
        ]
      },
      {
        day: 19,
        title: "Scale: Open Images & iMaterialist",
        link: "https://www.kaggle.com/c/open-images-2019-instance-segmentation/leaderboard",
        tasks: [
          { title: "Open Images (Big Subset)", description: "Расширение классов. Масштабирование тренинга, оптимизации." },
          { title: "iMaterialist (Full)", description: "Тонкие границы. Сильные augment-политики, multi-scale." },
        ]
      },
      {
        day: 20,
        title: "WSI Optimization: HuBMAP Kidney & Organ",
        link: "https://www.kaggle.com/competitions/hubmap-kidney-segmentation",
        tasks: [
          { title: "HuBMAP Kidney (Eng)", description: "Максимум score. Production-подход к WSI, ускорение, chunk caching." },
          { title: "HuBMAP Organ (Domain)", description: "Domain shift robustness. Per-domain sampling, regularization." },
        ]
      },
      {
        day: 21,
        title: "Final: Contrails Latency & Cuties Hardcore",
        link: "https://www.kaggle.com/competitions/google-research-identify-contrails-reduce-global-warming",
        tasks: [
          { title: "Contrails Latency", description: "Быстрый inference. Mixed precision, умный resize/tiling." },
          { title: "Cuties Hardcore", description: "Жёсткий no-pretrained режим. Креативные эвристики, prompt-ансамбли." },
        ]
      },
    ]
  }
];

const TABULAR_WEEKS: Week[] = [
  {
    id: 1,
    title: "Неделя 1",
    subtitle: "Новичок — EDA, базовый FE, 'не сломай CV'",
    competitions: [
      {
        day: 1,
        title: "Titanic & House Prices",
        link: "https://www.kaggle.com/competitions/titanic",
        tasks: [
          { title: "Titanic (4ч)", description: "Пропуски, title из имени, family size. Быстрый EDA → baseline." },
          { title: "House Prices (4ч)", description: "Много категорий и пропусков. Обработка категорий, регрессия." },
        ]
      },
      {
        day: 2,
        title: "Cat in the Dat I & II",
        link: "https://www.kaggle.com/competitions/cat-in-the-dat",
        tasks: [
          { title: "Cat I (4ч)", description: "Encoding-стратегии (one-hot/target/count), борьба с leakage." },
          { title: "Cat II (4ч)", description: "Взаимодействия. Аккуратный target encoding внутри фолда, регуляризация." },
        ]
      },
      {
        day: 3,
        title: "Otto Group & TPS Mar 2021",
        link: "https://www.kaggle.com/competitions/otto-group-product-classification-challenge",
        tasks: [
          { title: "Otto Group (4ч)", description: "Мультикласс, logloss. Калибровка вероятностей, базовые ансамбли." },
          { title: "TPS Mar 2021 (4ч)", description: "Синтетика. Sanity-checks, стабильный CV, быстрый FE." },
        ]
      },
      {
        day: 4,
        title: "Credit Scoring & TPS Apr 2021",
        link: "https://www.kaggle.com/c/GiveMeSomeCredit",
        tasks: [
          { title: "Give Me Some Credit", description: "Выбросы, 'плохие' распределения. Чистка, robust preprocessing." },
          { title: "TPS Apr 2021", description: "Синтетический Titanic. Быстрое тестирование гипотез по фичам." },
        ]
      },
      {
        day: 5,
        title: "Challenge Mode: Linear & Small Feats",
        link: "https://www.kaggle.com/competitions/house-prices-advanced-regression-techniques",
        tasks: [
          { title: "House Prices (Linear)", description: "Только линейные модели/ElasticNet. Борьба с мультиколлинеарностью." },
          { title: "Titanic (5 features)", description: "Только 5 фич. Сжатие сигнала, отбор лучшего." },
        ]
      },
      {
        day: 6,
        title: "Feature Selection: TPS Feb & Apr 2022",
        link: "https://www.kaggle.com/competitions/tabular-playground-series-feb-2022",
        tasks: [
          { title: "TPS Feb 2022", description: "Near-duplicate/derived фичи. Отбор фич, проверка утечек." },
          { title: "TPS Apr 2022", description: "Чистый FE + хороший CV. Пайплайн 'быстро → чисто → устойчиво'." },
        ]
      },
      {
        day: 7,
        title: "Lite Mode: Porto Seguro & Santander",
        link: "https://www.kaggle.com/competitions/porto-seguro-safe-driver-prediction",
        tasks: [
          { title: "Porto Seguro (Lite)", description: "Фичи-группы. Взаимодействия/бинирование, аккуратная валидация." },
          { title: "Santander Trans (Lite)", description: "Анонимные фичи. Регуляризация, 'не верь EDA', стабильный CV." },
        ]
      },
    ]
  },
  {
    id: 2,
    title: "Неделя 2",
    subtitle: "Средний уровень — агрегации, мульти-таблицы, time/group CV",
    competitions: [
      {
        day: 8,
        title: "Santander Value & Transaction",
        link: "https://www.kaggle.com/competitions/santander-value-prediction-challenge",
        tasks: [
          { title: "Santander Value", description: "Анонимная регрессия. FE для числовых, blending." },
          { title: "Santander Trans (Hard)", description: "Adversarial validation. Поиск сдвига train vs test." },
        ]
      },
      {
        day: 9,
        title: "Allstate & Porto Seguro (Full)",
        link: "https://www.kaggle.com/c/allstate-claims-severity",
        tasks: [
          { title: "Allstate Claims", description: "Регрессия, non-linear. Target transforms, устойчивость к выбросам." },
          { title: "Porto Seguro (Full)", description: "Interactions обязательны. Генерация пар/троек без утечки." },
        ]
      },
      {
        day: 10,
        title: "Liberty Mutual & Prudential Life",
        link: "https://www.kaggle.com/c/liberty-mutual-group-property-inspection-prediction",
        tasks: [
          { title: "Liberty Mutual", description: "Анонимные фичи. Агрегация/частоты, вытаскивание сигнала." },
          { title: "Prudential Life", description: "Ordinal задача (уровни риска). Подход к ordinal targets, кастом-метрики." },
        ]
      },
      {
        day: 11,
        title: "Rental Listing & Rossmann Sales",
        link: "https://www.kaggle.com/c/two-sigma-connect-rental-listing-inquiries",
        tasks: [
          { title: "Rental Listing", description: "Group-aware CV. Обработка дат/категорий, признаки 'смысла'." },
          { title: "Rossmann (Lite)", description: "Time-based CV. Лаги, скользящие признаки, аккуратные join’ы." },
        ]
      },
      {
        day: 12,
        title: "Elo Merchant & Home Credit (Lite)",
        link: "https://www.kaggle.com/competitions/elo-merchant-category-recommendation",
        tasks: [
          { title: "Elo Merchant", description: "Heavy FE. Агрегации по времени (count/sum/mean), recent vs long-term." },
          { title: "Home Credit (Lite)", description: "Несколько таблиц. FE через joins + контроль утечек по клиенту." },
        ]
      },
      {
        day: 13,
        title: "Fraud Detection: IEEE-CIS & TalkingData",
        link: "https://www.kaggle.com/competitions/ieee-fraud-detection",
        tasks: [
          { title: "IEEE-CIS (Lite)", description: "Транзакции + ID. Правильные сплиты, агрегации, борьбу с ID-утечками." },
          { title: "TalkingData (Lite)", description: "Огромные логи. High-cardinality агрегации, оптимизация памяти." },
        ]
      },
      {
        day: 14,
        title: "Validation Drill: Playground & Tag",
        link: "https://kaggle.com/competitions/playground-series",
        tasks: [
          { title: "Playground CV", description: "Сравнить 5 схем CV (KFold, Strat, Group, Time, Repeated)." },
          { title: "Tabular Tag Drill", description: "Повтори пайплайн любой 'playground' за 4 часа. Скорость, эксперименты." },
        ]
      },
    ]
  },
  {
    id: 3,
    title: "Неделя 3",
    subtitle: "Хардкор — утечки, сдвиг, стабильность, 'узкие' данные",
    competitions: [
      {
        day: 15,
        title: "Home Credit & IEEE-CIS (Full)",
        link: "https://www.kaggle.com/competitions/home-credit-default-risk",
        tasks: [
          { title: "Home Credit (Full)", description: "Multi-table FE + GroupKFold. Industrial FE, дисциплина." },
          { title: "IEEE-CIS (Full)", description: "Anti-leak проверки, adversarial validation, устойчивость." },
        ]
      },
      {
        day: 16,
        title: "Time Series FE: TalkingData & Amex",
        link: "https://www.kaggle.com/competitions/talkingdata-adtracking-fraud-detection",
        tasks: [
          { title: "TalkingData (Full)", description: "Time windows (1m/1h/1d). FE на логах, скорость." },
          { title: "Amex Default", description: "Последовательные записи. Агрегирование по клиенту + time-aware CV." },
        ]
      },
      {
        day: 17,
        title: "Stability: Home Credit Model & Rossmann",
        link: "https://www.kaggle.com/competitions/home-credit-credit-risk-model-stability",
        tasks: [
          { title: "Home Credit Stability", description: "Устойчивость во времени. Контроль дрейфа, 'не переобучай фолды'." },
          { title: "Rossmann (Strict)", description: "Strict Time Split. Честное прогнозирование будущего." },
        ]
      },
      {
        day: 18,
        title: "Mini-Mode: M5 & Zillow",
        link: "https://www.kaggle.com/competitions/m5-forecasting-accuracy",
        tasks: [
          { title: "M5 Forecasting", description: "Subset рядов. Иерархические/лаговые фичи, осторожный CV." },
          { title: "Zillow Prize", description: "High-cardinality. Memory optimization, регуляризация." },
        ]
      },
      {
        day: 19,
        title: "Anti-Leak: Don't Overfit & Santander",
        link: "https://www.kaggle.com/c/dont-overfit-ii",
        tasks: [
          { title: "Don't Overfit! II", description: "Мало train. Сверх-аккуратный CV, feature selection, anti-leak mindset." },
          { title: "Santander Anti-Leak", description: "Диагностика утечек. Доказать, что фича 'подглядывает', и убрать." },
        ]
      },
      {
        day: 20,
        title: "Ensembling: Elo & Allstate",
        link: "https://www.kaggle.com/competitions/elo-merchant-category-recommendation",
        tasks: [
          { title: "Elo Ensembles", description: "3 набора агрегатов + 2 модели + blending. Воспроизводимость." },
          { title: "Allstate Ensembles", description: "3 seed’а + 2 вида target transform + blending. Стабильные улучшения." },
        ]
      },
      {
        day: 21,
        title: "Final Rehearsal: IOAI Mode",
        link: "https://kaggle.com/competitions/playground-series",
        tasks: [
          { title: "Strict CV Drill", description: "Запрещён encoding с таргетом вне фолда. Железная дисциплина." },
          { title: "Final Sprint", description: "За 4 часа 'с нуля' повтори лучший пайплайн на другом соревновании." },
        ]
      },
    ]
  }
];

export const TRACKS: Track[] = [
  {
    id: 'image',
    title: 'Image / Classification',
    description: 'Master Computer Vision from MNIST to Metric Learning',
    weeks: IMAGE_WEEKS
  },
  {
    id: 'detection',
    title: 'Detection / Segmentation',
    description: 'Master Object Localization: from BBox to Masks',
    weeks: DETECTION_WEEKS
  },
  {
    id: 'segmentation',
    title: 'Segmentation / Masks',
    description: 'Pixel-Perfect: U-Net, RLE, and 3D Volumes',
    weeks: SEGMENTATION_WEEKS
  },
  {
    id: 'audio',
    title: 'Audio / Speech',
    description: 'Conquer Waveforms: From SpecAugment to ASR',
    weeks: AUDIO_WEEKS
  },
  {
    id: 'tabular',
    title: 'Tabular / Structured',
    description: 'From EDA to Ensembles: Mastering Structured Data',
    weeks: TABULAR_WEEKS
  }
];

export const WEEKS = IMAGE_WEEKS; // Backward compatibility

export const THEORY_TICKETS: Ticket[] = [
  {
    id: 1,
    title: "Оценка качества без утечек: CV как оценка риска",
    theory: [
      {
        title: "1. Дай определение",
        items: [
          "Data leakage как нарушение независимости между train и test по источнику информации.",
          "Risk R(f) и empirical risk. Почему K-fold CV — это оценка риска и где ломается математика при утечках."
        ]
      },
      {
        title: "2. Докажи/обоснуй",
        items: [
          "При i.i.d. и корректном split’е CV-оценка является состоятельной для риска.",
          "Контрпример: наличие групп (пациент/камера) делает наивный stratified split смещённым (optimistic bias)."
        ]
      },
      {
        title: "3. Группы и стратификация",
        items: [
          "Задача: разложить объекты по фолдам так, чтобы группы не пересекались, а распределение классов сохранялось.",
          "Почему последовательное применение 'сначала group, потом stratify' (и наоборот) проваливается."
        ]
      },
      {
        title: "4. Калибровка оценок",
        items: [
          "Почему 'среднее по фолдам accuracy' и 'accuracy по OOF предиктам' — разные объекты. Когда они совпадают, когда нет."
        ]
      }
    ],
    code: [
      {
        title: "Задача",
        items: ["Реализовать детерминированный сплиттер StratifiedGroupKFoldLite для single-label multiclass."]
      },
      {
        title: "1. Функция сплиттера",
        items: [
          `def stratified_group_kfold_indices(y, groups, n_splits: int, seed: int = 42):
    """
    Return: list of folds, where each fold is (train_idx, val_idx).
    Constraints: No group overlap between train/val; each sample in exactly one val fold;
    class distribution balanced greedily. Deterministic.
    """`
        ]
      },
      {
        title: "2. Валидатор утечек",
        items: [
          `def validate_no_group_leakage(folds, groups):
    """Raises AssertionError if any fold has group overlap."""`
        ]
      },
      {
        title: "3. Метрика качества",
        items: [
          `def stratification_deviation(y, folds):
    """Return max deviation D from global class distribution."""`
        ]
      },
      {
        title: "Требования",
        items: [
          "Сложность O(N log G) или лучше.",
          "Нельзя разрывать группы.",
          "Должно работать при n_splits > n_classes и дисбалансе групп."
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Near-duplicates: скрытая утечка через похожие картинки",
    theory: [
      {
        title: "1. Формализация",
        items: [
          "Отображение phi(x) (эмбеддинг/хеш). Near-duplicate если dist(phi(xi), phi(xj)) <= epsilon.",
          "Почему near-duplicate leakage ломает i.i.d. и дает 'магический' рост качества."
        ]
      },
      {
        title: "2. Графовая постановка",
        items: [
          "Граф G=(V,E), ребро если near-duplicate.",
          "Задача: не разрывать связанные компоненты между train/test."
        ]
      },
      {
        title: "3. Теория ошибки",
        items: [
          "Если доля объектов с дубликатами в другом сплите равна alpha, оценка смещается вверх (memorization).",
          "Контрпример: когда это не приводит к бусту."
        ]
      }
    ],
    code: [
      {
        title: "Задача",
        items: ["Реализовать 'дедуп-контур' на уровне сплита."]
      },
      {
        title: "1. Perceptual Hash",
        items: [
          `def dhash(image, hash_size: int = 8) -> int:
    """Grayscale -> resize -> compare adjacent pixels -> pack bits."""`
        ]
      },
      {
        title: "2. Поиск дубликатов",
        items: [
          `def hamming_distance_int(a: int, b: int) -> int: ...`,
          `def duplicate_components(hashes, max_hamming: int):
    """Return list of components (indices). Transitive closure required."""`
        ]
      },
      {
        title: "3. Сплит по компонентам",
        items: [
          `def split_by_components(components, n_splits: int, seed: int = 42): ...`
        ]
      },
      {
        title: "Требования",
        items: [
          "Транзитивность обязательна.",
          "Оптимизация поиска (bucket по префиксу, LSH или сортировка).",
          "Вернуть статистику по компонентам."
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Label noise: матрица шума и корректировка лосса",
    theory: [
      {
        title: "1. Модель шума",
        items: [
          "Истинная метка y, наблюдаемая y_tilde.",
          "Noise transition matrix T: Tij = P(y_tilde=j | y=i)."
        ]
      },
      {
        title: "2. Forward Correction",
        items: [
          "Если модель предсказывает p(y|x), то наблюдаем T.T @ p(y|x).",
          "Идея forward loss и условия идентифицируемости T."
        ]
      },
      {
        title: "3. Практика",
        items: [
          "Memorization: почему сначала учатся чистые паттерны, потом шум.",
          "Small-loss trick."
        ]
      }
    ],
    code: [
      {
        title: "Задача",
        items: ["Реализовать шумоустойчивую тренировку без внешних данных."]
      },
      {
        title: "1. Оценка T (Anchor method)",
        items: [
          `def estimate_T_anchor(probs, y_noisy, n_classes: int):
    """Find anchor samples (high prob) for each class, average their noisy labels."""`
        ]
      },
      {
        title: "2. Forward Corrected CE",
        items: [
          `def forward_corrected_ce(logits, y_noisy, T):
    """Compute CE on noisy distribution: softmax -> apply T -> CE vs y_noisy."""`
        ]
      },
      {
        title: "3. Протокол",
        items: [
          "Phase 1: Warmup (обычная CE) -> собрать probs.",
          "Phase 2: Estimate T -> Train with forward_corrected_ce."
        ]
      },
      {
        title: "Требования",
        items: [
          "Численная стабильность (log-space, clamp).",
          "T должна быть валидной стохастической матрицей."
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Long-tail и imbalance: logit adjustment",
    theory: [
      {
        title: "1. Приоры и Байес",
        items: [
          "Как меняются апостериоры P(y|x) при смене priors (label shift).",
          "Почему CE на дисбалансе тянет решение к частым классам."
        ]
      },
      {
        title: "2. Logit Adjustment",
        items: [
          "Доказательство: z' = z + log(pi) соответствует учету priors.",
          "Сравнение с class weights. Влияние на калибровку."
        ]
      },
      {
        title: "3. Effective Number",
        items: ["Идея 'effective number of samples' vs '1/n'."]
      }
    ],
    code: [
      {
        title: "Задача",
        items: ["Реализовать поддержку дисбаланса (head/loss/sampler)."]
      },
      {
        title: "1. Logit Adjustment Wrapper",
        items: [
          `class LogitAdjustedHead:
    def __init__(self, priors, tau=1.0): ...
    def __call__(self, logits): ...`
        ]
      },
      {
        title: "2. Class-balanced Weights",
        items: [
          `def class_balanced_weights(counts, beta=0.9999): ...`
        ]
      },
      {
        title: "3. Complex Loss",
        items: [
          `class ClassBalancedFocalLoss:
    """Focal + class-balanced weights + label smoothing."""`
        ]
      },
      {
        title: "4. Sampler",
        items: [
          `class BalancedBatchSampler:
    """Batch with K classes and M samples per class."""`
        ]
      }
    ]
  },
  {
    id: 5,
    title: "TTA как оцениватель: bias/variance и правило агрегации",
    theory: [
      {
        title: "1. Постановка",
        items: [
          "TTA-предикт как оценка Монте-Карло: E[p(y|g(x))].",
          "Требование согласованности трансформаций с инвариантностями."
        ]
      },
      {
        title: "2. Bias vs Variance",
        items: [
          "Усреднение уменьшает дисперсию (O(1/K)), но вводит bias (если трансформ нарушает семантику).",
          "Контрпримеры: label non-invariant transforms, domain shift в аугментациях."
        ]
      },
      {
        title: "3. Агрегация: Logits vs Probs",
        items: [
          "Сравнение prob-mean, logit-mean, geom-mean.",
          "Почему они не эквивалентны. Какой лучше при плохой калибровке или высокой уверенности."
        ]
      },
      {
        title: "4. BN/Dropout ловушки",
        items: [
          "Почему TTA при model.train() — ошибка.",
          "Проблемы с BatchNorm на тесте (stats mismatch) и BN-adaptation."
        ]
      }
    ],
    code: [
      {
        title: "Задача",
        items: ["Реализовать универсальный TTA-раннер для PyTorch."]
      },
      {
        title: "1. TTA Pipeline",
        items: [
          `def tta_predict(model, images, tta_transforms, merge="logit_mean", amp=True, return_all=False):
    """
    Return: probs (B, C), optionally all_probs (K, B, C).
    Constraints: handle eval mode, no_grad, numerical stability, DataParallel support.
    """`
        ]
      },
      {
        title: "2. Stability Estimation",
        items: [
          `def tta_disagreement(all_probs):
    """Return per-sample uncertainty proxy (e.g. KL div to mean)."""`
        ]
      },
      {
        title: "Требования",
        items: [
          "Не ломать режим модели (вернуть train/eval как было).",
          "Geom-mean через log-space.",
          "Поддержка Multilabel (sigmoid) и Multiclass (softmax)."
        ]
      }
    ]
  },
  {
    id: 6,
    title: "MixUp/CutMix как VRM: мягкие метки и корректный loss",
    theory: [
      {
        title: "1. Vicinal Risk Minimization",
        items: [
          "MixUp как оптимизация на 'окрестностях' примеров.",
          "Inductive bias линейности/гладкости."
        ]
      },
      {
        title: "2. Распределение lambda",
        items: [
          "Beta(alpha, alpha). Влияние alpha на регуляризацию.",
          "Зачем делают max(lambda, 1-lambda)."
        ]
      },
      {
        title: "3. CutMix",
        items: [
          "Почему для CutMix lambda — это доля площади патча.",
          "Нарушение семантики классов в CutMix."
        ]
      },
      {
        title: "4. Loss на soft labels",
        items: [
          "Формула Cross Entropy для soft targets.",
          "Почему нельзя просто делать argmax."
        ]
      }
    ],
    code: [
      {
        title: "Задача",
        items: ["Реализовать боевой модуль аугментаций и лосса."]
      },
      {
        title: "1. MixUp Applicator",
        items: [
          `def apply_mixup(images, targets, alpha, seed=None):
    """Return images_mix, targets_mix, lam (B,). Deterministic option."""`
        ]
      },
      {
        title: "2. CutMix Applicator",
        items: [
          `def rand_bbox(H, W, lam, rng): ...`,
          `def apply_cutmix(images, targets, alpha, seed=None):
    """Return mix, targets, lam_adj (computed from exact bbox area)."""`
        ]
      },
      {
        title: "3. Wrapper",
        items: [
          `class MixAugment:
    """Handles probs for MixUp/CutMix/None."""`
        ]
      },
      {
        title: "4. Soft Target Loss",
        items: [
          `def soft_target_ce(logits, soft_targets):
    """Stable implementation using log_softmax."""`
        ]
      }
    ]
  },
  {
    id: 7,
    title: "ResNet50 под микроскопом: bottleneck и BN режимы",
    theory: [
      {
        title: "1. Bottleneck Block",
        items: [
          "Структура: 1x1 reduce -> 3x3 -> 1x1 expand. Stride placement.",
          "Экономия FLOPs."
        ]
      },
      {
        title: "2. Skip Connection",
        items: [
          "Градиентный поток и стабилизация.",
          "Pre-activation ResNet динамика."
        ]
      },
      {
        title: "3. BatchNorm Internals",
        items: [
          "Running mean/var vs Affine params.",
          "Почему fine-tuning на малом батче ломает статистику."
        ]
      },
      {
        title: "4. GroupNorm",
        items: [
          "Преимущества при малых батчах. Проблемы конвертации BN->GN."
        ]
      }
    ],
    code: [
      {
        title: "Задача",
        items: ["Реализовать блоки ResNet и утилиты для BN."]
      },
      {
        title: "1. Bottleneck",
        items: [
          `class Bottleneck(nn.Module):
    """Standard ResNet50 block. Handle downsample and expansion."""`
        ]
      },
      {
        title: "2. Stage Builder",
        items: [
          `def make_stage(in_ch, mid_ch, blocks, stride, norm_layer): ...`
        ]
      },
      {
        title: "3. BN Utilities",
        items: [
          `def set_bn_eval(module):
    """Set BN to eval mode, keep model in train mode."""`,
          `def freeze_bn_affine(module):
    """Set requires_grad=False for BN params."""`,
          `def convert_bn_to_gn(module, num_groups=32):
    """In-place replacement."""`
        ]
      }
    ]
  },
  {
    id: 8,
    title: "EMA/SWA: усреднение весов и пересчёт BN",
    theory: [
      {
        title: "1. Polyak Averaging (EMA)",
        items: [
          "Формула обновления. Связь mu с effective window.",
          "Сглаживание траектории SGD."
        ]
      },
      {
        title: "2. SWA",
        items: [
          "Отличия от EMA. Необходимость пересчета BN."
        ]
      },
      {
        title: "3. BN Statistics",
        items: [
          "Почему нельзя инферить сразу после усреднения весов.",
          "Процедура пересчета running stats без утечки."
        ]
      },
      {
        title: "4. Инженерные ловушки",
        items: [
          "DDP, buffers, parameter groups. Что усреднять?"
        ]
      }
    ],
    code: [
      {
        title: "Задача",
        items: ["Реализовать EMA/SWA 'по-взрослому'."]
      },
      {
        title: "1. EMA Class",
        items: [
          `class EMA:
    def update(self, model): ...
    def store(self, model): ...
    def copy_to(self, model): ...
    def restore(self, model): ...
    """Handle DDP unwrapping and shadow params."""`
        ]
      },
      {
        title: "2. Context Manager",
        items: [
          `@contextmanager
def ema_scope(ema, model):
    """Safely swap params for validation."""`
        ]
      },
      {
        title: "3. BN Update",
        items: [
          `def bn_update(model, loader, device):
    """Recompute running stats. No gradients, no weight updates."""`
        ]
      },
      {
        title: "4. SWA Accumulator",
        items: [
          `class SWA:
    """Averages weights periodically."""`
        ]
      }
    ]
  },
  {
    id: 9,
    title: "Калибровка вероятностей: Temperature Scaling, ECE, Brier",
    theory: [
      {
        title: "1. Определи калибровку",
        items: [
          "Perfect calibration: P(Y=y|p)=p. Multiclass vs Multilabel.",
          "Почему высокая accuracy ≠ калиброванные вероятности."
        ]
      },
      {
        title: "2. Метрики",
        items: [
          "Различия: Accuracy (0-1), NLL (proper scoring), Brier score.",
          "Почему proper scoring rules стимулируют 'честные' вероятности."
        ]
      },
      {
        title: "3. Temperature Scaling",
        items: [
          "TS: z_T = z/T. Доказательство инвариантности argmax.",
          "Задача минимизации NLL по T (выпуклость)."
        ]
      },
      {
        title: "4. ECE & Smoothing",
        items: [
          "Expected Calibration Error: определение и смещение.",
          "Label smoothing: улучшает NLL, но может ухудшить confidence calibration."
        ]
      }
    ],
    code: [
      {
        title: "Задача",
        items: ["Сделать автономный блок калибровки и диагностики."]
      },
      {
        title: "1. Метрики",
        items: [
          `def multiclass_nll_from_logits(logits, y): ...`,
          `def brier_score_multiclass(probs, y, num_classes): ...`,
          `def expected_calibration_error(probs, y, n_bins=15, adaptive=False):
    """Adaptive binning option."""`
        ]
      },
      {
        title: "2. Temperature Scaler",
        items: [
          `class TemperatureScaler:
    def fit(self, logits_val, y_val): ...
    def transform_logits(self, logits): ...`
        ]
      },
      {
        title: "3. Calibration Report",
        items: [
          `def calibration_report(logits_val, y_val):
    """Return pre/post NLL, Brier, ECE, T."""`
        ]
      },
      {
        title: "Требования",
        items: [
          "Фитить только на валидации/OOF.",
          "Численная стабильность при больших логитах."
        ]
      }
    ]
  },
  {
    id: 10,
    title: "Метрика ≠ Loss: оптимальные пороги для F1",
    theory: [
      {
        title: "1. Неразложимые метрики",
        items: [
          "Почему Macro-F1/mAP не сводятся к сумме по объектам.",
          "Конфликт NLL и F1 (смещение порога)."
        ]
      },
      {
        title: "2. Оптимальное решение F-beta",
        items: [
          "Бинарный случай: порог зависит от распределения скоров, не 0.5.",
          "Алгоритм поиска порога за O(N log N)."
        ]
      },
      {
        title: "3. Multiclass vs Multilabel",
        items: [
          "Multiclass: Reject option / Top-k.",
          "Multilabel: Global vs Per-class thresholds."
        ]
      },
      {
        title: "4. Связь с калибровкой",
        items: ["Почему плохая калибровка ломает переносимость порога."]
      }
    ],
    code: [
      {
        title: "Задача",
        items: ["Написать оптимизатор порогов."]
      },
      {
        title: "1. Binary Search",
        items: [
          `def best_f1_threshold_binary(probs, y_true):
    """Use sorting + prefix sums. O(N log N)."""`
        ]
      },
      {
        title: "2. Multilabel Thresholds",
        items: [
          `def fit_thresholds_multilabel(probs, y_true):
    """Per-class thresholds maximizing F1."""`,
          `def best_global_threshold_multilabel(probs, y_true): ...`
        ]
      },
      {
        title: "3. Multiclass Reject",
        items: [
          `def confidence_reject_predict(probs, conf_threshold):
    """Return prediction or -1 (reject)."""`
        ]
      },
      {
        title: "Требования",
        items: [
          "Обработка классов без позитивов.",
          "Возможность обучения на OOF и применения на тесте."
        ]
      }
    ]
  },
  {
    id: 11,
    title: "SAM (Sharpness-Aware Minimization)",
    theory: [
      {
        title: "1. Определи Sharpness",
        items: [
          "Минимизация loss в окрестности: min max L(theta+eps).",
          "Связь с flat minima и обобщающей способностью."
        ]
      },
      {
        title: "2. Двухшаговый алгоритм",
        items: [
          "Шаг 1: Найти eps (подъем по градиенту).",
          "Шаг 2: Обновить theta (спуску по градиенту в возмущенной точке)."
        ]
      },
      {
        title: "3. BN Instability",
        items: [
          "Почему SAM нестабилен с BN при малых батчах.",
          "Ghost BN / Freeze statistics."
        ]
      },
      {
        title: "4. Compute Budget",
        items: ["Удвоение forward+backward. Оптимизации (ASAM, accumulation)."]
      }
    ],
    code: [
      {
        title: "Задача",
        items: ["Реализовать SAM wrapper и AMP-интеграцию."]
      },
      {
        title: "1. SAM Optimizer",
        items: [
          `class SAM:
    def first_step(self, zero_grad=True): ...
    def second_step(self, zero_grad=True): ...
    """Base optimizer wrapper."""`
        ]
      },
      {
        title: "2. AMP Train Step",
        items: [
          `def train_step_sam_amp(model, batch, criterion, sam_opt, scaler):
    """Handle autocast, unscale, clip, double backward."""`
        ]
      },
      {
        title: "Требования",
        items: [
          "Корректная нормировка градиента.",
          "Работа с frozen параметрами.",
          "AMP: unscale перед клиппингом."
        ]
      }
    ]
  },
  {
    id: 12,
    title: "Энсамбли и стеккинг: OOF как единственный честный способ",
    theory: [
      {
        title: "1. Разложение ошибки",
        items: [
          "Diversity (корреляция ошибок) vs Accuracy.",
          "Почему однотипные модели мало помогают."
        ]
      },
      {
        title: "2. Logits vs Probs",
        items: [
          "Geom mean (logits sum) vs Arith mean (probs sum).",
          "Устойчивость geom mean к overconfidence."
        ]
      },
      {
        title: "3. Stacking & Blending",
        items: [
          "Meta-learner на OOF (строго!).",
          "Задача оптимизации NLL."
        ]
      },
      {
        title: "4. Simplex Blending",
        items: [
          "Оптимизация весов на симплексе (sum=1, w>=0).",
          "Почему это стабильнее линейного стеккера."
        ]
      }
    ],
    code: [
      {
        title: "Задача",
        items: ["Реализовать OOF стеккер и simplex blending."]
      },
      {
        title: "1. Diversity",
        items: [
          `def pairwise_logit_correlation(oof_logits_list):
    """Pearson corr matrix between model confidences."""`
        ]
      },
      {
        title: "2. Simplex Blend",
        items: [
          `def fit_simplex_blend(oof_logits_list, y):
    """Projected gradient descent for weights."""`
        ]
      },
      {
        title: "3. Meta-Learner",
        items: [
          `class LogitStacker:
    """Logistic regression on concatenated logits."""`
        ]
      },
      {
        title: "4. Inference",
        items: [
          `def make_submission_probs(blend_w, logits_list, mode): ...`
        ]
      },
      {
        title: "Требования",
        items: [
          "Никакого подглядывания в тест или трейн (только OOF).",
          "Регуляризация для стеккера."
        ]
      }
    ]
  }
];