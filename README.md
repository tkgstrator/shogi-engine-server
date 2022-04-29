# 将棋エンジンサーバー

やねうら王v7.0.0をNodeJSで動作させるサーバーです. Dockerさえ動けばありとあらゆる環境で動作します.

## 背景

モバイルデバイスは十分高速になりましたが, デスクトップやラップトップにはまだまだ性能で劣ります. また, モバイルデバイスでの検討はバッテリーを消費させることにもなり, 使い勝手がよくありません.

[KENTO](https://www.kento-shogi.com)のサービスは非常に魅力的ですが, 旧バージョンのやねうら王6.0.0を採用していることや, 専有リソースでないことからより本格的に検討したい方の要求を満たすものではありませんでした. また, ソースコードが公開されていないこともあり, KENTOサーバーを改良して自分専用の検討サーバを立てることは不可能でした.

OSSで動作する検討サーバには[shogi-board-server](https://github.com/murosan/shogi-board-server)がありますが, これはHTTPプロトコルを採用しているため, 指定した時間までは全くレスポンスが得られないなどいくつかの問題が存在しました.

そこで, 環境依存性が全くなく, 誰もがフリーで使え, 双方向通信が可能な検討サーバーが求められました.

## 利用方法

利用方法は非常に簡単です.

```
git clone https://github.com/tkgstrator/shogi-engine-server.git
cd shogi-engine-server
make engine
make up
```

これだけでローカルに検討サーバが立ちます. エンジンはデフォルトではARM64用のバイナリを利用するようになっているため, x86_64を利用している方は`Makefile`の`M1Mac`を`IntelMac`に書き換えてください.

## プロトコル

### 環境設定

現在実装中です.

### 最善手検索

`localhost:3000`の`bestmove`に対して以下のフォーマットのJSONを送信します. Multi PVには現在対応していません.

`limit_type`は指定するとその時間, ノード数, 深さのどれかまで探索が進んだ時点で検討を終了します. 複数指定することはできません.

- `limit_type`
  - `time`
  - `node`
  - `depth`

考量時間無制限は現在対応していません.

- `position`
  - SFEN形式のみ対応
 
盤面状態はSFEN形式のみ対応しています. 指定しない場合は初期局面になります.

```json
{
    "position": "sfen lnsgk1snl/6g2/p2ppp2p/2p6/4B2r1/9/P1SPPPP1P/2G4S1/LN2KG1NL b R4Pb2p 27",
    "limit": {
        "limit_type": "time",
        "value": 10000
    }
}
```

以下のようなレスポンスが得られると思います.

```json
{
    "depth": 28,
    "seldepth": 41,
    "score": -1732,
    "nodes": 37496297,
    "nps": 3749254,
    "hashfull": 902,
    "time": 10001,
    "pv": [
        "R*2g",
        "P*2f",
        "2g2f",
        "2e2f",
        "P*2g",
        "R*8e",
        "2g2f",
        "8e5e",
        "R*8h",
        "P*8b",
        "7g6f",
        "5e5d",
        "5i4h",
        "5d2d",
        "4i3h",
        "2d2f",
        "2h2g",
        "2f2d",
        "P*2f",
        "2a3c",
        "8i7g",
        "5a5b",
        "8h8i",
        "7d7e",
        "6f7e",
        "P*7f",
        "7g6e",
        "2d5d",
        "2g3f",
        "3a4b",
        "P*7d",
        "6a7b",
        "4h5h"
    ],
    "bestmove": "R*2g",
    "ponder": "P*2f",
    "multipv": 1
}
```
  
Postmanを使ってテストをする場合は以下の画像のように`Listeners`に`bestmove`を追加してください. そうでないとレスポンスを受け取ることができません.

![](https://pbs.twimg.com/media/FRfxHv6aMAEUl45?format=jpg&name=4096x4096)
