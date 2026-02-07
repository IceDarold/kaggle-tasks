import { Week, Ticket } from './types';

export const WEEKS: Week[] = [
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