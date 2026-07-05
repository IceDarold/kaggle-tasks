import { Week, Ticket, Track, CodeSnippet } from './types';

const IMAGE_SNIPPETS: CodeSnippet[] = [
  // --- SECTION 1: BASELINE (Essential for first sub) ---
  {
    title: "01. [Baseline] Seed Everything",
    category: "Baseline",
    description: "The absolute first step. Ensures your experiments are reproducible and deterministic.",
    code: `import os
import random
import numpy as np
import torch

def seed_everything(seed=42):
    random.seed(seed)
    os.environ['PYTHONHASHSEED'] = str(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed(seed)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False # True for speed, False for exact repro

seed_everything(42)`
  },
  {
    title: "02. [Baseline] Stratified K-Fold CV",
    category: "Baseline",
    description: "The gold standard for validation. Ensures class distribution is preserved across folds. Do this BEFORE creating datasets.",
    code: `from sklearn.model_selection import StratifiedKFold

# 1. Create Folds
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
df['fold'] = -1
for fold, (train_idx, val_idx) in enumerate(skf.split(df, df['target'])):
    df.loc[val_idx, 'fold'] = fold

# 2. Usage in Loop
for fold in range(5):
    train_df = df[df['fold'] != fold].reset_index(drop=True)
    valid_df = df[df['fold'] == fold].reset_index(drop=True)
    # ... init loaders and train ...`
  },
  {
    title: "03. [Baseline] Custom Dataset Class",
    category: "Baseline",
    description: "Standard PyTorch Dataset template. Handles image loading (OpenCV) and applying transforms.",
    code: `import cv2
import torch
from torch.utils.data import Dataset

class CustomDataset(Dataset):
    def __init__(self, df, transforms=None, mode='train'):
        self.df = df
        self.transforms = transforms
        self.mode = mode
        # Pre-load file paths to avoid overhead
        self.file_names = df['file_path'].values
        # Only load targets if training/validating
        self.labels = df['target'].values if mode != 'test' else None

    def __len__(self):
        return len(self.df)

    def __getitem__(self, index):
        # 1. Load Image
        image_path = self.file_names[index]
        image = cv2.imread(image_path)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        # 2. Apply Augmentations
        if self.transforms:
            augmented = self.transforms(image=image)
            image = augmented['image']

        # 3. Return (Image, Label) or (Image,)
        if self.mode != 'test':
            label = torch.tensor(self.labels[index], dtype=torch.long)
            return image, label
        else:
            return image`
  },
  {
    title: "04. [Baseline] DataLoader Setup",
    category: "Baseline",
    description: "Optimized data loading. Critical params: num_workers, pin_memory, and drop_last for training.",
    code: `from torch.utils.data import DataLoader

# Constants
BATCH_SIZE = 32
IMG_SIZE = 384
NUM_WORKERS = 4 # Usually count of CPU cores

# Init Datasets
train_dataset = CustomDataset(train_df, transforms=get_train_transforms(IMG_SIZE), mode='train')
valid_dataset = CustomDataset(valid_df, transforms=get_valid_transforms(IMG_SIZE), mode='valid')

# Init Loaders
train_loader = DataLoader(
    train_dataset, 
    batch_size=BATCH_SIZE, 
    shuffle=True, 
    num_workers=NUM_WORKERS, 
    pin_memory=True, # Faster data transfer to GPU
    drop_last=True   # Good for BN statistics
)

valid_loader = DataLoader(
    valid_dataset, 
    batch_size=BATCH_SIZE, 
    shuffle=False, 
    num_workers=NUM_WORKERS, 
    pin_memory=True
)`
  },
  {
    title: "05. [Baseline] Model Init (timm)",
    category: "Baseline",
    description: "Using 'timm' is the industry standard. Quickly swap backbones (EfficientNet, ConvNeXt, ResNet).",
    code: `import timm
import torch.nn as nn

class CloudModel(nn.Module):
    def __init__(self, model_name='tf_efficientnet_b0_ns', pretrained=True, num_classes=5):
        super().__init__()
        # Load backbone
        self.model = timm.create_model(model_name, pretrained=pretrained)
        
        # Replace classifier head
        # 'classifier' name varies: 'fc' (ResNet), 'head' (ViT), 'classifier' (EffNet)
        in_features = self.model.classifier.in_features
        self.model.classifier = nn.Sequential(
            nn.Dropout(p=0.2),
            nn.Linear(in_features, num_classes)
        )

    def forward(self, x):
        return self.model(x)

# Usage
model = CloudModel(model_name='convnext_tiny', num_classes=10)
model = model.cuda()`
  },

  // --- SECTION 2: OPTIMIZATION (Speed & Convergence) ---
  {
    title: "06. [Optimization] AMP (Mixed Precision)",
    category: "Optimization",
    description: "Drastically reduces VRAM usage and speeds up training. Standard in modern PyTorch.",
    code: `from torch.cuda.amp import autocast, GradScaler

scaler = GradScaler()

# Training Loop
for images, labels in train_loader:
    optimizer.zero_grad()
    
    with autocast():
        outputs = model(images)
        loss = criterion(outputs, labels)
    
    scaler.scale(loss).backward()
    scaler.step(optimizer)
    scaler.update()`
  },
  {
    title: "07. [Optimization] Learning Rate Schedulers",
    category: "Optimization",
    description: "Choosing the right scheduler is critical. Here are the Top-3 industry standards for different scenarios.",
    code: `from torch.optim.lr_scheduler import CosineAnnealingWarmRestarts, OneCycleLR, ReduceLROnPlateau

# Option 1: Cosine Annealing with Warm Restarts (The "Default" Winner)
# Use when: You want stable convergence and are training for many epochs.
# Helps escape local minima by "restarting" the LR.
scheduler = CosineAnnealingWarmRestarts(
    optimizer, 
    T_0=10,      # First restart after 10 epochs
    T_mult=2,    # Double the cycle length after restart (10 -> 20 -> 40...)
    eta_min=1e-6 # Minimum LR
)
# Call: scheduler.step() (usually per epoch)


# Option 2: One Cycle Policy (Super-Convergence)
# Use when: You have a fixed budget (e.g., 5-10 epochs) and need maximum speed.
# Starts low, goes high, ends very low.
scheduler = OneCycleLR(
    optimizer,
    max_lr=1e-3,
    steps_per_epoch=len(train_loader),
    epochs=EPOCHS,
    pct_start=0.3, # 30% of time warming up
    div_factor=25  # init_lr = max_lr / 25
)
# Call: scheduler.step() (MUST be called per batch)


# Option 3: Reduce LR On Plateau (Old reliable)
# Use when: Fine-tuning or when training length is unknown.
# Drops LR when validation metric stops improving.
scheduler = ReduceLROnPlateau(
    optimizer,
    mode='min',  # 'min' for loss, 'max' for accuracy/metric
    factor=0.1,  # new_lr = lr * 0.1
    patience=5,  # Wait 5 epochs with no improvement
    verbose=True
)
# Call: scheduler.step(val_loss) (per epoch, requires metric)`
  },

  // --- SECTION 3: AUGMENTATION & REGULARIZATION ---
  {
    title: "08. [Augmentation] Albumentations",
    category: "Augmentation",
    description: "Competitive pipeline. Key: CoarseDropout (Cutout), ShiftScaleRotate, and Color Jitter.",
    code: `import albumentations as A
from albumentations.pytorch import ToTensorV2

def get_train_transforms(size):
    return A.Compose([
        A.Resize(size, size),
        A.HorizontalFlip(p=0.5),
        A.VerticalFlip(p=0.5),
        A.ShiftScaleRotate(shift_limit=0.0625, scale_limit=0.2, rotate_limit=45, p=0.5),
        
        # Color & Noise
        A.OneOf([
            A.HueSaturationValue(hue_shift_limit=0.2, sat_shift_limit=0.2, val_shift_limit=0.2, p=0.9),
            A.RandomBrightnessContrast(brightness_limit=0.2, contrast_limit=0.2, p=0.9),
        ], p=0.5),
        
        # Regularization (Cutout)
        A.CoarseDropout(max_holes=8, max_height=int(size*0.1), max_width=int(size*0.1), p=0.5),
        
        A.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ToTensorV2(),
    ])`
  },
  {
    title: "09. [Regularization] MixUp & CutMix",
    category: "Augmentation",
    description: "SOTA regularization. Mixes images and labels to enforce linearity. Use inside train loop.",
    code: `import numpy as np
import torch

def mixup_data(x, y, alpha=1.0, use_cuda=True):
    '''Returns mixed inputs, pairs of targets, and lambda'''
    if alpha > 0:
        lam = np.random.beta(alpha, alpha)
    else:
        lam = 1

    batch_size = x.size()[0]
    if use_cuda:
        index = torch.randperm(batch_size).cuda()
    else:
        index = torch.randperm(batch_size)

    mixed_x = lam * x + (1 - lam) * x[index, :]
    y_a, y_b = y, y[index]
    return mixed_x, y_a, y_b, lam

def mixup_criterion(criterion, pred, y_a, y_b, lam):
    return lam * criterion(pred, y_a) + (1 - lam) * criterion(pred, y_b)

# Usage inside train loop:
# inputs, targets_a, targets_b, lam = mixup_data(inputs, targets, alpha=0.4)
# outputs = model(inputs)
# loss = mixup_criterion(criterion, outputs, targets_a, targets_b, lam)`
  },
  {
    title: "10. [Regularization] Label Smoothing",
    category: "Augmentation",
    description: "Prevents over-confidence. Use this instead of vanilla CrossEntropy.",
    code: `import torch.nn as nn

# Modern PyTorch
criterion = nn.CrossEntropyLoss(label_smoothing=0.1)

# Or manual (if needed for old versions):
# confidence = 1.0 - epsilon
# smooth_prob = epsilon / (num_classes - 1)
# ...`
  },

  // --- SECTION 4: ADVANCED / SPECIFIC ---
  {
    title: "11. [Advanced] ArcFace Head",
    category: "Advanced",
    description: "Essential for 'Identity' tasks (Whales, Landmarks). Maximizes inter-class separability.",
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F
import math

class ArcMarginProduct(nn.Module):
    def __init__(self, in_features, out_features, s=30.0, m=0.50):
        super(ArcMarginProduct, self).__init__()
        self.in_features = in_features
        self.out_features = out_features
        self.s = s
        self.m = m
        self.weight = nn.Parameter(torch.FloatTensor(out_features, in_features))
        nn.init.xavier_uniform_(self.weight)

    def forward(self, input, label):
        # cosine = input_norm * weight_norm
        cosine = F.linear(F.normalize(input), F.normalize(self.weight))
        phi = cosine - self.m
        
        # one_hot label conversion
        one_hot = torch.zeros(cosine.size(), device=input.device)
        one_hot.scatter_(1, label.view(-1, 1).long(), 1)
        
        output = (one_hot * phi) + ((1.0 - one_hot) * cosine)
        output *= self.s
        return output`
  },

  // --- SECTION 5: INFERENCE (The Winning Edge) ---
  {
    title: "12. [Inference] TTA (Test Time Aug)",
    category: "Inference",
    description: "Cheap score boost. Average predictions on augmented inputs (Flip, Crop).",
    code: `model.eval()
all_probs = []

with torch.no_grad():
    for images in test_loader:
        images = images.to(device)
        
        # 1. Original
        out1 = model(images).softmax(1)
        
        # 2. Horizontal Flip
        out2 = model(torch.flip(images, dims=[3])).softmax(1) 
        
        # 3. Vertical Flip (if relevant)
        out3 = model(torch.flip(images, dims=[2])).softmax(1)

        avg_preds = (out1 + out2 + out3) / 3
        all_probs.append(avg_preds)`
  },
  {
    title: "13. [Inference] Ensembling",
    category: "Inference",
    description: "The final step. Combine models with low correlation for maximum score.",
    code: `import numpy as np

# Probs from Model A (e.g., EfficientNet)
probs_a = np.load('effnet_oof.npy') 
# Probs from Model B (e.g., Swin Transformer)
probs_b = np.load('swin_oof.npy')

# Optimize weights on OOF (e.g., using scipy.optimize or simple grid search)
w_a = 0.6
w_b = 0.4

ensemble_probs = w_a * probs_a + w_b * probs_b
# final_preds = np.argmax(ensemble_probs, axis=1)`
  }
];

const TABULAR_SNIPPETS: CodeSnippet[] = [
  // --- SECTION 1: BASELINE (First valid submission) ---
  {
    title: "01. [Baseline] Load + Quick EDA",
    category: "Baseline",
    description: "The first 5 minutes: understand shape, target, missing values, duplicates, and categorical cardinality.",
    code: `import pandas as pd
import numpy as np

train = pd.read_csv('/kaggle/input/competition/train.csv')
test = pd.read_csv('/kaggle/input/competition/test.csv')
sample = pd.read_csv('/kaggle/input/competition/sample_submission.csv')

TARGET = 'target'
ID_COL = 'id'

print('train:', train.shape)
print('test :', test.shape)
print('sample:', sample.shape)

display(train.head())
display(test.head())
display(sample.head())

print(train.info())
display(train.describe(include='all').T)

print('target distribution:')
display(train[TARGET].value_counts(dropna=False).head(20))

missing = train.isna().mean().sort_values(ascending=False)
display(missing[missing > 0].head(30))

print('duplicates:', train.duplicated().sum())

cat_cols = train.select_dtypes(include=['object', 'category', 'bool']).columns.tolist()
cardinality = train[cat_cols].nunique(dropna=False).sort_values(ascending=False)
display(cardinality.head(30))`
  },
  {
    title: "02. [Baseline] Submission Contract",
    category: "Baseline",
    description: "Never guess the submission format. Read sample_submission and preserve ids/order exactly.",
    code: `sample = pd.read_csv('/kaggle/input/competition/sample_submission.csv')
print(sample.head())
print(sample.dtypes)
print(sample.shape)

id_col = sample.columns[0]
pred_cols = sample.columns[1:]

# Example: single target submission
submission = sample.copy()
submission[pred_cols[0]] = test_preds

# Sanity checks
assert submission.shape == sample.shape
assert submission[id_col].equals(sample[id_col])
assert submission.isna().sum().sum() == 0

submission.to_csv('submission.csv', index=False)
display(submission.head())`
  },
  {
    title: "03. [Validation] Split Strategy Selector",
    category: "Validation",
    description: "Choose validation from the data-generating process: stratified, grouped, regression, or time-based.",
    code: `from sklearn.model_selection import KFold, StratifiedKFold, GroupKFold

TARGET = 'target'
N_SPLITS = 5
SEED = 42

def add_folds(df, target=TARGET, task='classification', group_col=None, date_col=None):
    df = df.copy()
    df['fold'] = -1

    if date_col is not None:
        # For true time-series, prefer a dedicated time split snippet.
        df = df.sort_values(date_col).reset_index(drop=True)
        fold_size = len(df) // N_SPLITS
        for fold in range(N_SPLITS):
            start = fold * fold_size
            end = len(df) if fold == N_SPLITS - 1 else (fold + 1) * fold_size
            df.loc[start:end - 1, 'fold'] = fold
        return df

    if group_col is not None:
        splitter = GroupKFold(n_splits=N_SPLITS)
        split = splitter.split(df, df[target], groups=df[group_col])
    elif task == 'classification':
        splitter = StratifiedKFold(n_splits=N_SPLITS, shuffle=True, random_state=SEED)
        split = splitter.split(df, df[target])
    else:
        splitter = KFold(n_splits=N_SPLITS, shuffle=True, random_state=SEED)
        split = splitter.split(df)

    for fold, (_, valid_idx) in enumerate(split):
        df.loc[valid_idx, 'fold'] = fold
    return df

train = add_folds(train, task='classification')
display(train['fold'].value_counts().sort_index())`
  },
  {
    title: "04. [Validation] Time-Based Split",
    category: "Validation",
    description: "For sports, sales, finance, and logs: validate on the future, never on shuffled rows.",
    code: `DATE_COL = 'date'
TARGET = 'target'

df = train.copy()
df[DATE_COL] = pd.to_datetime(df[DATE_COL])
df = df.sort_values(DATE_COL).reset_index(drop=True)

valid_frac = 0.2
cut = int(len(df) * (1 - valid_frac))

train_df = df.iloc[:cut].reset_index(drop=True)
valid_df = df.iloc[cut:].reset_index(drop=True)

print(train_df[DATE_COL].min(), '->', train_df[DATE_COL].max(), train_df.shape)
print(valid_df[DATE_COL].min(), '->', valid_df[DATE_COL].max(), valid_df.shape)

assert train_df[DATE_COL].max() <= valid_df[DATE_COL].min()

features = [c for c in df.columns if c not in [TARGET, DATE_COL]]
X_train, y_train = train_df[features], train_df[TARGET]
X_valid, y_valid = valid_df[features], valid_df[TARGET]`
  },
  {
    title: "05. [Baseline] CatBoost",
    category: "Baseline",
    description: "Strong default for messy tabular data with categorical features. Great first serious submission.",
    code: `from catboost import CatBoostClassifier, CatBoostRegressor
from sklearn.metrics import roc_auc_score, accuracy_score, mean_squared_error

TARGET = 'target'
DROP_COLS = ['fold', TARGET]

features = [c for c in train.columns if c not in DROP_COLS]
cat_cols = train[features].select_dtypes(include=['object', 'category', 'bool']).columns.tolist()

fold = 0
train_df = train[train['fold'] != fold].reset_index(drop=True)
valid_df = train[train['fold'] == fold].reset_index(drop=True)

model = CatBoostClassifier(
    iterations=2000,
    learning_rate=0.03,
    depth=6,
    loss_function='Logloss',
    eval_metric='AUC',
    random_seed=42,
    verbose=200,
    early_stopping_rounds=100,
    allow_writing_files=False
)

model.fit(
    train_df[features], train_df[TARGET],
    eval_set=(valid_df[features], valid_df[TARGET]),
    cat_features=cat_cols
)

valid_pred = model.predict_proba(valid_df[features])[:, 1]
print('AUC:', roc_auc_score(valid_df[TARGET], valid_pred))

test_pred = model.predict_proba(test[features])[:, 1]`
  },
  {
    title: "06. [Baseline] LightGBM",
    category: "Baseline",
    description: "Fast gradient boosting baseline. Useful for large data and quick iteration.",
    code: `import lightgbm as lgb
from sklearn.metrics import roc_auc_score

TARGET = 'target'
features = [c for c in train.columns if c not in ['fold', TARGET]]
cat_cols = train[features].select_dtypes(include=['object', 'category', 'bool']).columns.tolist()

for col in cat_cols:
    train[col] = train[col].astype('category')
    test[col] = test[col].astype('category')

fold = 0
train_df = train[train['fold'] != fold].reset_index(drop=True)
valid_df = train[train['fold'] == fold].reset_index(drop=True)

model = lgb.LGBMClassifier(
    n_estimators=5000,
    learning_rate=0.03,
    num_leaves=64,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42,
    n_jobs=-1
)

model.fit(
    train_df[features], train_df[TARGET],
    eval_set=[(valid_df[features], valid_df[TARGET])],
    eval_metric='auc',
    callbacks=[lgb.early_stopping(100), lgb.log_evaluation(200)]
)

valid_pred = model.predict_proba(valid_df[features])[:, 1]
print('AUC:', roc_auc_score(valid_df[TARGET], valid_pred))

test_pred = model.predict_proba(test[features])[:, 1]`
  },
  {
    title: "07. [Preprocessing] Column Type Detector",
    category: "Preprocessing",
    description: "Create a clean feature map before modeling: ids, dates, categorical, numeric, and constants.",
    code: `def detect_columns(train, test=None, target='target'):
    cols = [c for c in train.columns if c != target]
    
    id_cols = [c for c in cols if c.lower() in ['id', 'row_id'] or c.lower().endswith('_id')]
    constant_cols = [c for c in cols if train[c].nunique(dropna=False) <= 1]
    
    date_cols = []
    for c in cols:
        if train[c].dtype == 'object' and ('date' in c.lower() or 'time' in c.lower()):
            date_cols.append(c)
        elif np.issubdtype(train[c].dtype, np.datetime64):
            date_cols.append(c)
    
    cat_cols = train[cols].select_dtypes(include=['object', 'category', 'bool']).columns.tolist()
    num_cols = train[cols].select_dtypes(include=[np.number]).columns.tolist()
    
    drop_cols = sorted(set(id_cols + constant_cols))
    feature_cols = [c for c in cols if c not in drop_cols]
    
    return {
        'features': feature_cols,
        'numeric': [c for c in num_cols if c in feature_cols],
        'categorical': [c for c in cat_cols if c in feature_cols],
        'dates': [c for c in date_cols if c in feature_cols],
        'ids': id_cols,
        'constants': constant_cols,
        'drop': drop_cols
    }

cols = detect_columns(train, test, target='target')
for key, value in cols.items():
    print(key, len(value), value[:20])`
  },
  {
    title: "08. [Features] Date Features",
    category: "Features",
    description: "Turn dates into robust numeric features. Works for matches, sales, events, and logs.",
    code: `def add_date_features(df, date_col):
    df = df.copy()
    dt = pd.to_datetime(df[date_col])
    
    df[f'{date_col}_year'] = dt.dt.year
    df[f'{date_col}_month'] = dt.dt.month
    df[f'{date_col}_day'] = dt.dt.day
    df[f'{date_col}_dayofweek'] = dt.dt.dayofweek
    df[f'{date_col}_weekofyear'] = dt.dt.isocalendar().week.astype(int)
    df[f'{date_col}_is_weekend'] = (dt.dt.dayofweek >= 5).astype(int)
    df[f'{date_col}_days_from_start'] = (dt - dt.min()).dt.days
    
    return df

for col in ['date']:
    train = add_date_features(train, col)
    test = add_date_features(test, col)`
  },
  {
    title: "09. [Features] Groupby Aggregations",
    category: "Features",
    description: "Classic tabular lift: summarize numeric behavior by team, user, product, category, city, etc.",
    code: `def add_groupby_aggregations(train, test, group_cols, agg_cols, stats=('mean', 'std', 'min', 'max', 'count')):
    train = train.copy()
    test = test.copy()
    full = pd.concat([train.drop(columns=['target'], errors='ignore'), test], axis=0, ignore_index=True)

    for group_col in group_cols:
        for agg_col in agg_cols:
            agg = full.groupby(group_col)[agg_col].agg(stats)
            agg.columns = [f'{group_col}_{agg_col}_{stat}' for stat in stats]
            
            train = train.merge(agg, on=group_col, how='left')
            test = test.merge(agg, on=group_col, how='left')

    return train, test

group_cols = ['team']
agg_cols = ['goals_for', 'goals_against']

train, test = add_groupby_aggregations(train, test, group_cols, agg_cols)`
  },
  {
    title: "10. [Features] Rolling Features Without Leakage",
    category: "Features",
    description: "For ordered data: compute team/user history using shift(1), so the current row never sees its own target.",
    code: `def add_rolling_features(df, group_col, date_col, value_cols, windows=(3, 5, 10)):
    df = df.copy()
    df[date_col] = pd.to_datetime(df[date_col])
    df = df.sort_values([group_col, date_col]).reset_index(drop=True)
    
    for value_col in value_cols:
        shifted = df.groupby(group_col)[value_col].shift(1)
        
        for window in windows:
            name = f'{group_col}_{value_col}_roll{window}_mean'
            df[name] = (
                shifted
                .groupby(df[group_col])
                .rolling(window, min_periods=1)
                .mean()
                .reset_index(level=0, drop=True)
            )
        
        df[f'{group_col}_{value_col}_expanding_mean'] = (
            shifted
            .groupby(df[group_col])
            .expanding(min_periods=1)
            .mean()
            .reset_index(level=0, drop=True)
        )
    
    return df

# Example: team form before each match
train = add_rolling_features(
    train,
    group_col='team',
    date_col='date',
    value_cols=['goals_for', 'goals_against'],
    windows=(3, 5)
)`
  },
  {
    title: "11. [Encoding] OOF Target Encoding",
    category: "Encoding",
    description: "High-cardinality categorical encoding without leakage. Fit mapping only on the training folds.",
    code: `from sklearn.model_selection import StratifiedKFold

def oof_target_encode(train, test, col, target, n_splits=5, smoothing=20, seed=42):
    train = train.copy()
    test = test.copy()
    global_mean = train[target].mean()
    encoded_col = f'{col}_target_enc'
    train[encoded_col] = np.nan

    skf = StratifiedKFold(n_splits=n_splits, shuffle=True, random_state=seed)
    for tr_idx, val_idx in skf.split(train, train[target]):
        tr = train.iloc[tr_idx]
        stats = tr.groupby(col)[target].agg(['mean', 'count'])
        smooth = (stats['mean'] * stats['count'] + global_mean * smoothing) / (stats['count'] + smoothing)
        train.loc[val_idx, encoded_col] = train.loc[val_idx, col].map(smooth)

    full_stats = train.groupby(col)[target].agg(['mean', 'count'])
    full_smooth = (full_stats['mean'] * full_stats['count'] + global_mean * smoothing) / (full_stats['count'] + smoothing)
    test[encoded_col] = test[col].map(full_smooth)

    train[encoded_col] = train[encoded_col].fillna(global_mean)
    test[encoded_col] = test[encoded_col].fillna(global_mean)
    return train, test

for col in ['team', 'opponent']:
    train, test = oof_target_encode(train, test, col=col, target='target')`
  },
  {
    title: "12. [Training] OOF Loop + Test Averaging",
    category: "Training",
    description: "The core Kaggle pattern: train each fold, store OOF predictions, average test predictions.",
    code: `from catboost import CatBoostClassifier
from sklearn.metrics import roc_auc_score

TARGET = 'target'
features = [c for c in train.columns if c not in ['fold', TARGET]]
cat_cols = train[features].select_dtypes(include=['object', 'category', 'bool']).columns.tolist()

oof = np.zeros(len(train))
test_preds = np.zeros(len(test))

for fold in sorted(train['fold'].unique()):
    print(f'Fold {fold}')
    valid_idx = train.index[train['fold'] == fold]
    train_df = train[train['fold'] != fold].reset_index(drop=True)
    valid_df = train.loc[valid_idx].reset_index(drop=True)
    
    model = CatBoostClassifier(
        iterations=3000,
        learning_rate=0.03,
        depth=6,
        loss_function='Logloss',
        eval_metric='AUC',
        random_seed=42 + fold,
        early_stopping_rounds=150,
        verbose=300,
        allow_writing_files=False
    )
    
    model.fit(
        train_df[features], train_df[TARGET],
        eval_set=(valid_df[features], valid_df[TARGET]),
        cat_features=cat_cols
    )
    
    oof[valid_idx] = model.predict_proba(valid_df[features])[:, 1]
    test_preds += model.predict_proba(test[features])[:, 1] / train['fold'].nunique()

print('OOF AUC:', roc_auc_score(train[TARGET], oof))`
  },
  {
    title: "13. [Inference] Thresholding + Blending",
    category: "Inference",
    description: "Optimize thresholds on OOF for F1 and blend models using validation, not leaderboard guessing.",
    code: `from sklearn.metrics import f1_score

def find_best_threshold(y_true, probs):
    best_thr, best_score = 0.5, -1
    for thr in np.linspace(0.01, 0.99, 99):
        score = f1_score(y_true, probs >= thr)
        if score > best_score:
            best_thr, best_score = thr, score
    return best_thr, best_score

# Threshold optimization
best_thr, best_f1 = find_best_threshold(train['target'].values, oof_cat)
print('best threshold:', best_thr, 'OOF F1:', best_f1)

final_binary_preds = (test_preds_cat >= best_thr).astype(int)

# Simple OOF-weighted blending
best_w, best_auc = 0.5, -1
for w in np.linspace(0, 1, 21):
    blend_oof = w * oof_cat + (1 - w) * oof_lgb
    score = roc_auc_score(train['target'], blend_oof)
    if score > best_auc:
        best_w, best_auc = w, score

print('best blend weight:', best_w, 'OOF AUC:', best_auc)
blend_test = best_w * test_preds_cat + (1 - best_w) * test_preds_lgb`
  }
];

const SEGMENTATION_SNIPPETS: CodeSnippet[] = [
  // --- SECTION 1: BASELINE (Understand the task contract) ---
  {
    title: "01. [Baseline] Inspect Files + Submission",
    category: "Baseline",
    description: "Start by finding images, labels, mask format, empty masks, and the exact submission columns.",
    code: `from pathlib import Path
import pandas as pd
import numpy as np

ROOT = Path('/kaggle/input/competition')

print('top-level files:')
for path in sorted(ROOT.iterdir()):
    print(path)

csv_files = sorted(ROOT.rglob('*.csv'))
print('csv files:', [str(p) for p in csv_files])

train = pd.read_csv(ROOT / 'train.csv')
sample = pd.read_csv(ROOT / 'sample_submission.csv')

display(train.head())
display(sample.head())
print('train shape:', train.shape)
print('sample shape:', sample.shape)
print(train.dtypes)

image_dirs = [p for p in ROOT.rglob('*') if p.is_dir() and any(p.glob('*.jpg'))]
image_dirs += [p for p in ROOT.rglob('*') if p.is_dir() and any(p.glob('*.png'))]
print('image dirs:', image_dirs[:10])

for col in train.columns:
    if train[col].dtype == 'object':
        print(col, 'nunique=', train[col].nunique(dropna=False), 'missing=', train[col].isna().mean())`
  },
  {
    title: "02. [Masks] RLE Decode / Encode",
    category: "Masks",
    description: "Kaggle segmentation often uses column-major RLE. Keep decode, encode, and roundtrip check together.",
    code: `import numpy as np
import pandas as pd

def rle_decode(mask_rle, shape):
    if pd.isna(mask_rle) or mask_rle == '' or mask_rle == '-1':
        return np.zeros(shape, dtype=np.uint8)
    
    s = str(mask_rle).split()
    starts = np.asarray(s[0::2], dtype=np.int64) - 1
    lengths = np.asarray(s[1::2], dtype=np.int64)
    ends = starts + lengths
    
    mask = np.zeros(shape[0] * shape[1], dtype=np.uint8)
    for lo, hi in zip(starts, ends):
        mask[lo:hi] = 1
    
    return mask.reshape(shape, order='F')

def rle_encode(mask):
    pixels = np.asarray(mask, dtype=np.uint8).reshape(-1, order='F')
    pixels = np.concatenate([[0], pixels, [0]])
    runs = np.where(pixels[1:] != pixels[:-1])[0] + 1
    runs[1::2] -= runs[::2]
    return ' '.join(str(x) for x in runs)

# Roundtrip sanity check
dummy = np.zeros((8, 8), dtype=np.uint8)
dummy[2:5, 3:6] = 1
encoded = rle_encode(dummy)
decoded = rle_decode(encoded, dummy.shape)
assert np.array_equal(dummy, decoded)
print('RLE OK:', encoded)`
  },
  {
    title: "03. [Masks] Build Mask From Labels",
    category: "Masks",
    description: "Convert per-image label rows into a binary or C-channel mask tensor.",
    code: `import numpy as np
import pandas as pd

def build_mask_from_labels(labels, image_id, shape, image_col='image_id', rle_col='EncodedPixels',
                           class_col=None, num_classes=None):
    rows = labels[labels[image_col] == image_id]
    
    if num_classes is None:
        mask = np.zeros(shape, dtype=np.uint8)
        for rle in rows[rle_col].dropna().values:
            mask |= rle_decode(rle, shape)
        return mask
    
    mask = np.zeros((num_classes, shape[0], shape[1]), dtype=np.uint8)
    for _, row in rows.iterrows():
        rle = row[rle_col]
        if pd.isna(rle) or rle == '' or rle == '-1':
            continue
        cls = int(row[class_col]) - 1
        mask[cls] |= rle_decode(rle, shape)
    return mask

# Binary example
# mask = build_mask_from_labels(train, image_id='0001.jpg', shape=(256, 1600))

# Multiclass example
# mask = build_mask_from_labels(train, '0001.jpg', (256, 1600), class_col='class_id', num_classes=4)`
  },
  {
    title: "04. [Visualization] Image + Mask Overlay",
    category: "Visualization",
    description: "Always visualize image, mask, and overlay before training. This catches alignment and RLE mistakes.",
    code: `import cv2
import matplotlib.pyplot as plt

def read_image(path):
    image = cv2.imread(str(path))
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    return image

def show_image_mask(image, mask, title=None, alpha=0.45):
    if mask.ndim == 3:
        mask2d = mask.max(axis=0)
    else:
        mask2d = mask
    
    overlay = image.copy()
    color = np.zeros_like(image)
    color[..., 0] = 255
    overlay = np.where(mask2d[..., None] > 0, (1 - alpha) * overlay + alpha * color, overlay)
    overlay = overlay.astype(np.uint8)
    
    fig, axes = plt.subplots(1, 3, figsize=(15, 5))
    axes[0].imshow(image)
    axes[0].set_title('image')
    axes[1].imshow(mask2d, cmap='gray')
    axes[1].set_title('mask')
    axes[2].imshow(overlay)
    axes[2].set_title('overlay')
    
    if title:
        fig.suptitle(title)
    for ax in axes:
        ax.axis('off')
    plt.show()

# image = read_image(TRAIN_IMAGE_DIR / image_id)
# mask = build_mask_from_labels(train, image_id, shape=image.shape[:2])
# show_image_mask(image, mask, image_id)`
  },
  {
    title: "05. [Validation] Stratified Split By Mask Area",
    category: "Validation",
    description: "Preserve empty/non-empty ratio and rough mask size distribution across folds.",
    code: `import numpy as np
import pandas as pd
from sklearn.model_selection import StratifiedKFold

def rle_area(mask_rle):
    if pd.isna(mask_rle) or mask_rle == '' or mask_rle == '-1':
        return 0
    lengths = np.asarray(str(mask_rle).split()[1::2], dtype=np.int64)
    return int(lengths.sum())

def make_image_level_folds(labels, image_col='image_id', rle_col='EncodedPixels', n_splits=5, seed=42):
    meta = (
        labels
        .assign(mask_area=labels[rle_col].map(rle_area))
        .groupby(image_col, as_index=False)['mask_area']
        .sum()
    )
    meta['has_mask'] = (meta['mask_area'] > 0).astype(int)
    meta['area_bin'] = 0
    
    non_empty = meta['mask_area'] > 0
    if non_empty.sum() > 1:
        q = min(4, non_empty.sum())
        meta.loc[non_empty, 'area_bin'] = (
            pd.qcut(meta.loc[non_empty, 'mask_area'], q=q, labels=False, duplicates='drop')
            .astype(int) + 1
        )
    
    meta['stratify'] = meta['has_mask'].astype(str) + '_' + meta['area_bin'].astype(str)
    meta['fold'] = -1
    
    skf = StratifiedKFold(n_splits=n_splits, shuffle=True, random_state=seed)
    for fold, (_, valid_idx) in enumerate(skf.split(meta, meta['stratify'])):
        meta.loc[valid_idx, 'fold'] = fold
    
    return meta

image_df = make_image_level_folds(train)
display(pd.crosstab(image_df['fold'], image_df['has_mask']))`
  },
  {
    title: "06. [Validation] Group Split",
    category: "Validation",
    description: "If images share patient, video, scene, or case ids, split by group to avoid near-duplicate leakage.",
    code: `from sklearn.model_selection import GroupKFold

def add_group_folds(image_df, group_col, n_splits=5):
    image_df = image_df.copy()
    image_df['fold'] = -1
    
    splitter = GroupKFold(n_splits=n_splits)
    for fold, (_, valid_idx) in enumerate(splitter.split(image_df, groups=image_df[group_col])):
        image_df.loc[valid_idx, 'fold'] = fold
    
    return image_df

# Example:
# image_df = add_group_folds(image_df, group_col='patient_id')
# for fold in sorted(image_df['fold'].unique()):
#     valid_groups = set(image_df.loc[image_df['fold'] == fold, 'patient_id'])
#     train_groups = set(image_df.loc[image_df['fold'] != fold, 'patient_id'])
#     assert valid_groups.isdisjoint(train_groups)`
  },
  {
    title: "07. [Dataset] Binary Segmentation Dataset",
    category: "Dataset",
    description: "Dataset for one foreground mask. Returns image tensor and mask tensor with shape 1 x H x W.",
    code: `from pathlib import Path
import torch
from torch.utils.data import Dataset

class BinarySegDataset(Dataset):
    def __init__(self, image_df, labels, image_dir, image_col='image_id', rle_col='EncodedPixels',
                 transforms=None, mode='train', mask_shape=None):
        self.image_df = image_df.reset_index(drop=True)
        self.labels = labels
        self.image_dir = Path(image_dir)
        self.image_col = image_col
        self.rle_col = rle_col
        self.transforms = transforms
        self.mode = mode
        self.mask_shape = mask_shape
        self.rles_by_image = labels.groupby(image_col)[rle_col].apply(list).to_dict()
    
    def __len__(self):
        return len(self.image_df)
    
    def __getitem__(self, idx):
        image_id = self.image_df.loc[idx, self.image_col]
        image = read_image(self.image_dir / image_id)
        
        if self.mode != 'test':
            shape = self.mask_shape or image.shape[:2]
            mask = np.zeros(shape, dtype=np.uint8)
            for rle in self.rles_by_image.get(image_id, []):
                mask |= rle_decode(rle, shape)
            
            if self.transforms:
                augmented = self.transforms(image=image, mask=mask)
                image, mask = augmented['image'], augmented['mask']
            
            if mask.ndim == 2:
                mask = mask.unsqueeze(0) if torch.is_tensor(mask) else mask[None]
            mask = mask.float() if torch.is_tensor(mask) else torch.tensor(mask, dtype=torch.float32)
            return image, mask
        
        if self.transforms:
            image = self.transforms(image=image)['image']
        return image, image_id`
  },
  {
    title: "08. [Dataset] Multiclass Segmentation Dataset",
    category: "Dataset",
    description: "Dataset for C independent defect classes. Useful for Severstal-like multilabel masks.",
    code: `from pathlib import Path
import numpy as np
import pandas as pd
import torch
from torch.utils.data import Dataset

class MulticlassSegDataset(Dataset):
    def __init__(self, image_df, labels, image_dir, num_classes, image_col='image_id',
                 rle_col='EncodedPixels', class_col='class_id', transforms=None, mode='train',
                 mask_shape=None):
        self.image_df = image_df.reset_index(drop=True)
        self.labels = labels
        self.image_dir = Path(image_dir)
        self.num_classes = num_classes
        self.image_col = image_col
        self.rle_col = rle_col
        self.class_col = class_col
        self.transforms = transforms
        self.mode = mode
        self.mask_shape = mask_shape
        self.rows_by_image = {k: v for k, v in labels.groupby(image_col)}
    
    def __len__(self):
        return len(self.image_df)
    
    def __getitem__(self, idx):
        image_id = self.image_df.loc[idx, self.image_col]
        image = read_image(self.image_dir / image_id)
        
        if self.mode == 'test':
            if self.transforms:
                image = self.transforms(image=image)['image']
            return image, image_id
        
        shape = self.mask_shape or image.shape[:2]
        mask = np.zeros((shape[0], shape[1], self.num_classes), dtype=np.uint8)
        rows = self.rows_by_image.get(image_id)
        if rows is not None:
            for _, row in rows.iterrows():
                if pd.isna(row[self.rle_col]) or row[self.rle_col] == '-1':
                    continue
                cls = int(row[self.class_col]) - 1
                mask[..., cls] |= rle_decode(row[self.rle_col], shape)
        
        if self.transforms:
            augmented = self.transforms(image=image, mask=mask)
            image, mask = augmented['image'], augmented['mask']
        
        if mask.ndim == 3 and not torch.is_tensor(mask):
            mask = np.transpose(mask, (2, 0, 1))
        elif torch.is_tensor(mask) and mask.ndim == 3:
            mask = mask.permute(2, 0, 1)
        mask = mask.float() if torch.is_tensor(mask) else torch.tensor(mask, dtype=torch.float32)
        return image, mask`
  },
  {
    title: "09. [Augmentation] Safe Segmentation Transforms",
    category: "Augmentation",
    description: "Use transforms that move image and mask together. Keep geometry modest until the pipeline is proven.",
    code: `import albumentations as A
from albumentations.pytorch import ToTensorV2

def get_train_transforms(size):
    return A.Compose([
        A.Resize(size, size),
        A.HorizontalFlip(p=0.5),
        A.VerticalFlip(p=0.5),
        A.ShiftScaleRotate(
            shift_limit=0.05,
            scale_limit=0.10,
            rotate_limit=15,
            border_mode=0,
            p=0.5
        ),
        A.OneOf([
            A.RandomBrightnessContrast(p=1.0),
            A.HueSaturationValue(p=1.0),
        ], p=0.4),
        A.Normalize(mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225)),
        ToTensorV2(),
    ])

def get_valid_transforms(size):
    return A.Compose([
        A.Resize(size, size),
        A.Normalize(mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225)),
        ToTensorV2(),
    ])`
  },
  {
    title: "10. [Model] Pretrained U-Net / FPN",
    category: "Model",
    description: "Fast strong baseline using segmentation_models_pytorch. Swap encoder and classes without rewriting training.",
    code: `# Kaggle if missing:
# !pip install -q segmentation-models-pytorch

import torch
import segmentation_models_pytorch as smp

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

def build_seg_model(architecture='unet', encoder='resnet34', in_channels=3, classes=1):
    if architecture == 'unet':
        return smp.Unet(
            encoder_name=encoder,
            encoder_weights='imagenet',
            in_channels=in_channels,
            classes=classes,
            activation=None
        )
    
    if architecture == 'fpn':
        return smp.FPN(
            encoder_name=encoder,
            encoder_weights='imagenet',
            in_channels=in_channels,
            classes=classes,
            activation=None
        )
    
    raise ValueError(f'unknown architecture: {architecture}')

model = build_seg_model(architecture='unet', encoder='resnet34', classes=1)
model = model.to(device)`
  },
  {
    title: "11. [Loss] BCE + Dice Loss",
    category: "Loss",
    description: "Robust default for binary or multilabel segmentation. BCE stabilizes pixels; Dice optimizes overlap.",
    code: `import torch
import torch.nn as nn

class DiceLoss(nn.Module):
    def __init__(self, eps=1e-7):
        super().__init__()
        self.eps = eps
    
    def forward(self, logits, targets):
        probs = torch.sigmoid(logits)
        targets = targets.float()
        
        dims = (0, 2, 3)
        intersection = torch.sum(probs * targets, dims)
        cardinality = torch.sum(probs + targets, dims)
        dice = (2.0 * intersection + self.eps) / (cardinality + self.eps)
        return 1.0 - dice.mean()

class BCEDiceLoss(nn.Module):
    def __init__(self, bce_weight=0.5):
        super().__init__()
        self.bce = nn.BCEWithLogitsLoss()
        self.dice = DiceLoss()
        self.bce_weight = bce_weight
    
    def forward(self, logits, targets):
        return self.bce_weight * self.bce(logits, targets.float()) + (1 - self.bce_weight) * self.dice(logits, targets)

criterion = BCEDiceLoss(bce_weight=0.5)`
  },
  {
    title: "12. [Metrics] Dice / IoU",
    category: "Metrics",
    description: "Compute competition-like overlap metrics from logits with an explicit threshold.",
    code: `import torch

def dice_score(logits, targets, threshold=0.5, eps=1e-7):
    probs = torch.sigmoid(logits)
    preds = (probs > threshold).float()
    targets = targets.float()
    
    dims = (0, 2, 3)
    intersection = torch.sum(preds * targets, dims)
    cardinality = torch.sum(preds + targets, dims)
    dice = (2.0 * intersection + eps) / (cardinality + eps)
    return dice.mean().item()

def iou_score(logits, targets, threshold=0.5, eps=1e-7):
    probs = torch.sigmoid(logits)
    preds = (probs > threshold).float()
    targets = targets.float()
    
    dims = (0, 2, 3)
    intersection = torch.sum(preds * targets, dims)
    union = torch.sum(preds + targets, dims) - intersection
    iou = (intersection + eps) / (union + eps)
    return iou.mean().item()

# valid_dice = dice_score(logits, masks, threshold=0.5)`
  },
  {
    title: "13. [Training] AMP Train One Epoch",
    category: "Training",
    description: "One focused training loop. Keep it small so errors are easy to localize.",
    code: `import numpy as np
from torch.cuda.amp import autocast, GradScaler
from tqdm.auto import tqdm

scaler = GradScaler()

def train_one_epoch(model, loader, optimizer, criterion, device):
    model.train()
    losses = []
    
    for images, masks in tqdm(loader, desc='train'):
        images = images.to(device, non_blocking=True)
        masks = masks.to(device, non_blocking=True)
        
        optimizer.zero_grad(set_to_none=True)
        with autocast():
            logits = model(images)
            loss = criterion(logits, masks)
        
        scaler.scale(loss).backward()
        scaler.step(optimizer)
        scaler.update()
        
        losses.append(loss.item())
    
    return float(np.mean(losses))`
  },
  {
    title: "14. [Validation] Valid Loop + Threshold Search",
    category: "Validation",
    description: "Collect validation probabilities once, then choose the threshold that maximizes Dice or IoU.",
    code: `import numpy as np
import torch
from tqdm.auto import tqdm

@torch.no_grad()
def predict_valid(model, loader, device):
    model.eval()
    probs_all, masks_all = [], []
    
    for images, masks in tqdm(loader, desc='valid'):
        images = images.to(device, non_blocking=True)
        logits = model(images)
        probs = torch.sigmoid(logits).cpu()
        probs_all.append(probs)
        masks_all.append(masks.cpu())
    
    return torch.cat(probs_all), torch.cat(masks_all)

def dice_from_probs(probs, masks, threshold=0.5, eps=1e-7):
    preds = (probs > threshold).float()
    masks = masks.float()
    dims = (0, 2, 3)
    inter = torch.sum(preds * masks, dims)
    card = torch.sum(preds + masks, dims)
    return (((2 * inter + eps) / (card + eps)).mean().item())

def find_best_threshold(probs, masks):
    best_thr, best_score = 0.5, -1
    for thr in np.linspace(0.05, 0.95, 19):
        score = dice_from_probs(probs, masks, threshold=float(thr))
        if score > best_score:
            best_thr, best_score = float(thr), score
    return best_thr, best_score

valid_probs, valid_masks = predict_valid(model, valid_loader, device)
best_thr, best_dice = find_best_threshold(valid_probs, valid_masks)
print('best threshold:', best_thr, 'dice:', best_dice)`
  },
  {
    title: "15. [Inference] Flip TTA For Masks",
    category: "Inference",
    description: "Average original and flipped predictions, flipping logits back before aggregation.",
    code: `import torch

@torch.no_grad()
def predict_with_tta(model, images):
    model.eval()
    
    logits = model(images)
    
    h_logits = model(torch.flip(images, dims=[3]))
    h_logits = torch.flip(h_logits, dims=[3])
    
    v_logits = model(torch.flip(images, dims=[2]))
    v_logits = torch.flip(v_logits, dims=[2])
    
    avg_logits = (logits + h_logits + v_logits) / 3.0
    return torch.sigmoid(avg_logits)

# for images, image_ids in test_loader:
#     images = images.to(device)
#     probs = predict_with_tta(model, images).cpu().numpy()`
  },
  {
    title: "16. [Postprocess] Remove Small Components",
    category: "Postprocess",
    description: "Remove tiny noisy blobs after thresholding. Useful for cracks, defects, and satellite masks.",
    code: `import cv2

def remove_small_components(mask, min_size=100):
    mask = mask.astype(np.uint8)
    num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(mask, connectivity=8)
    
    cleaned = np.zeros_like(mask, dtype=np.uint8)
    for label in range(1, num_labels):
        area = stats[label, cv2.CC_STAT_AREA]
        if area >= min_size:
            cleaned[labels == label] = 1
    
    return cleaned

def postprocess_mask(prob, threshold=0.5, min_size=100):
    mask = (prob > threshold).astype(np.uint8)
    return remove_small_components(mask, min_size=min_size)

# mask = postprocess_mask(prob[0], threshold=best_thr, min_size=50)`
  },
  {
    title: "17. [Submission] RLE Submission",
    category: "Submission",
    description: "Run test inference, resize masks back if needed, postprocess, encode to RLE, and preserve sample columns.",
    code: `import pandas as pd
import torch
import torch.nn.functional as F
from tqdm.auto import tqdm

@torch.no_grad()
def make_rle_submission(model, test_loader, sample, threshold=0.5, min_size=100,
                        target_shape=None, id_col='image_id', pred_col='EncodedPixels'):
    model.eval()
    rows = []
    
    for images, image_ids in tqdm(test_loader, desc='test'):
        images = images.to(device, non_blocking=True)
        probs = predict_with_tta(model, images).cpu()
        
        if target_shape is not None and probs.shape[-2:] != target_shape:
            probs = F.interpolate(probs, size=target_shape, mode='bilinear', align_corners=False)
        
        probs = probs.numpy()
        for prob, image_id in zip(probs, image_ids):
            mask = postprocess_mask(prob[0], threshold=threshold, min_size=min_size)
            rle = rle_encode(mask)
            rows.append({id_col: image_id, pred_col: rle})
    
    submission = pd.DataFrame(rows)
    
    if id_col in sample.columns:
        submission = sample[[id_col]].merge(submission, on=id_col, how='left')
        submission[pred_col] = submission[pred_col].fillna('')
    
    return submission

submission = make_rle_submission(model, test_loader, sample, threshold=best_thr, min_size=50)
submission.to_csv('submission.csv', index=False)
display(submission.head())`
  },
  {
    title: "18. [Debug] Visualize Predictions",
    category: "Debug",
    description: "Compare image, ground truth, prediction, and overlay on validation samples before trusting the score.",
    code: `import numpy as np
import torch
import matplotlib.pyplot as plt

@torch.no_grad()
def visualize_predictions(model, dataset, indices, threshold=0.5, device='cuda'):
    model.eval()
    
    for idx in indices:
        image, true_mask = dataset[idx]
        x = image.unsqueeze(0).to(device)
        prob = torch.sigmoid(model(x)).cpu()[0, 0].numpy()
        pred_mask = (prob > threshold).astype(np.uint8)
        
        img_np = image.permute(1, 2, 0).cpu().numpy()
        mean = np.array([0.485, 0.456, 0.406])
        std = np.array([0.229, 0.224, 0.225])
        img_np = np.clip(img_np * std + mean, 0, 1)
        
        gt = true_mask[0].cpu().numpy()
        
        fig, axes = plt.subplots(1, 4, figsize=(18, 5))
        axes[0].imshow(img_np)
        axes[0].set_title('image')
        axes[1].imshow(gt, cmap='gray')
        axes[1].set_title('ground truth')
        axes[2].imshow(pred_mask, cmap='gray')
        axes[2].set_title('prediction')
        axes[3].imshow(img_np)
        axes[3].imshow(pred_mask, alpha=0.45, cmap='Reds')
        axes[3].set_title('overlay')
        
        for ax in axes:
            ax.axis('off')
        plt.show()

# visualize_predictions(model, valid_dataset, indices=[0, 1, 2], threshold=best_thr, device=device)`
  }
];

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

// ... (other weeks remain unchanged, just updating Image track)
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
    weeks: IMAGE_WEEKS,
    snippets: IMAGE_SNIPPETS
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
    weeks: SEGMENTATION_WEEKS,
    snippets: SEGMENTATION_SNIPPETS
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
    weeks: TABULAR_WEEKS,
    snippets: TABULAR_SNIPPETS
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
