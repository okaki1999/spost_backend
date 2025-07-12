# 🚀 Spost Backend - NestJS API

SpostアプリケーションのバックエンドAPIサーバーです。位置情報ベースのSNS機能を提供します。

## 🛠️ 技術スタック

- **NestJS** - Node.jsフレームワーク
- **Prisma ORM** - データベースORM
- **PostgreSQL + PostGIS** - 地理空間データベース
- **Firebase Admin SDK** - トークン検証
- **Supabase** - データベースホスティング

## 📋 機能

### 認証
- Firebase IDトークン検証
- ユーザー認証ガード
- セキュアなAPIエンドポイント

### 投稿管理
- 位置情報付き投稿作成
- 近くの投稿取得（100m以内）
- PostGISによる地理空間クエリ
- 投稿一覧表示

## 🚀 セットアップ

### 前提条件
- Node.js 18+
- PostgreSQL（Supabase推奨）
- Firebase プロジェクト

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 環境変数の設定
```bash
cp .env.example .env
```

`.env`ファイルを編集：
```env
DATABASE_URL="postgresql://username:password@host:port/database"
FIREBASE_PROJECT_ID="your-firebase-project-id"
FIREBASE_PRIVATE_KEY="your-firebase-private-key"
FIREBASE_CLIENT_EMAIL="your-firebase-client-email"
```

### 3. データベース設定
```bash
# データベースマイグレーション
npx prisma migrate dev

# Prismaクライアント生成
npx prisma generate
```

### 4. 開発サーバー起動
```bash
# 開発モード（ホットリロード）
npm run start:dev

# 本番モード
npm run start:prod

# デバッグモード
npm run start:debug
```

## 📁 プロジェクト構造

```
src/
├── auth/                 # 認証関連
│   ├── auth.guard.ts    # Firebase認証ガード
│   └── auth.decorator.ts # ユーザー情報デコレータ
├── posts/               # 投稿API
│   ├── posts.controller.ts # 投稿コントローラー
│   └── posts.service.ts    # 投稿サービス
├── firebase/            # Firebase設定
│   └── firebase.config.ts # Firebase Admin SDK設定
├── prisma/              # Prisma設定
│   └── prisma.service.ts # Prismaサービス
├── app.controller.ts    # メインコントローラー
├── app.service.ts       # メインサービス
├── app.module.ts        # アプリケーションモジュール
└── main.ts             # エントリーポイント
```

## 🔧 開発

### 利用可能なスクリプト
```bash
npm run build          # ビルド
npm run start          # 起動
npm run start:dev      # 開発モード（ホットリロード）
npm run start:debug    # デバッグモード
npm run start:prod     # 本番モード
npm run lint           # ESLint実行
npm run test           # ユニットテスト
npm run test:e2e       # E2Eテスト
npm run test:cov       # テストカバレッジ
```

### データベース管理
```bash
npx prisma studio      # Prisma Studio起動
npx prisma migrate dev # マイグレーション
npx prisma generate    # クライアント生成
npx prisma db push     # スキーマプッシュ
```

## 📊 API仕様

### エンドポイント

#### 投稿関連
- `GET /posts` - 近くの投稿取得
  - Query Parameters:
    - `lat`: 緯度
    - `lng`: 経度
  - Response: 100m以内の投稿一覧

- `POST /posts` - 新規投稿作成
  - Headers: `Authorization: Bearer <firebase-token>`
  - Body:
    ```json
    {
      "title": "投稿タイトル",
      "body": "投稿内容",
      "latitude": 35.6762,
      "longitude": 139.6503
    }
    ```

### 認証
- Firebase IDトークンを`Authorization: Bearer <token>`ヘッダーで送信
- 認証が必要なエンドポイントは自動的にトークンを検証

## 🌍 地理空間機能

### PostGIS統合
- 位置情報をPostGISの`geometry(Point,4326)`型で保存
- `ST_DWithin`関数による距離計算
- 現在は100m以内の投稿を取得

### 位置情報クエリ例
```sql
SELECT * FROM posts
WHERE ST_DWithin(
  location::geography,
  ST_MakePoint(longitude, latitude)::geography,
  100
)
ORDER BY "createdAt" DESC;
```

## 🚀 デプロイ

### Render（推奨）
1. Renderで新しいWeb Serviceを作成
2. GitHubリポジトリを接続
3. 環境変数を設定
4. ビルドコマンド: `npm install && npm run build`
5. 起動コマンド: `npm run start:prod`

### Railway
1. Railwayで新しいプロジェクトを作成
2. GitHubリポジトリを接続
3. 環境変数を設定
4. 自動デプロイ

## 🔒 セキュリティ

### CORS設定
```typescript
app.enableCors({
  origin: ['http://localhost:3000', 'https://your-frontend-domain.com'],
  credentials: true,
});
```

### Firebase認証
- Firebase Admin SDKによるトークン検証
- 無効なトークンは自動的に拒否
- ユーザー情報をリクエストに追加

## 🐛 トラブルシューティング

### よくある問題

**Prismaマイグレーションエラー**
```bash
# PostGIS拡張が有効になっているか確認
npx prisma db push
```

**Firebase認証エラー**
- Firebase設定が正しいか確認
- サービスアカウントキーの形式を確認
- 環境変数の設定を確認

**CORSエラー**
- フロントエンドのドメインがCORS設定に含まれているか確認

## 📞 サポート

問題が発生した場合は、GitHubのIssuesで報告してください。

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。
