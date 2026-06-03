---
layout: post
title: "人工智能生成内容 (AIGC) 期末复习资料"
tags: [期末复习]
---
> 基于 Final Review 所有重点范围，逐页对照课件整理。面向零基础小白，概念优先、公式辅助。

# 目录

1. [Transformer（Final Review 第 1-17 页）](#1-transformer)
2. [MoE 混合专家模型（Final Review 第 18-24 页）](#2-moe-混合专家模型)
3. [Latent Variable Models / VAE（Final Review 第 25-28 页）](#3-latent-variable-models--vae)
4. [GAN 生成对抗网络（Final Review 第 29-38 页）](#4-gan-生成对抗网络)
5. [Diffusion Model 扩散模型（Final Review 第 39-47 页）](#5-diffusion-model-扩散模型)
6. [Prompt Engineering 提示工程](#6-prompt-engineering-提示工程)
7. [Safety and Ethics 安全与伦理](#7-safety-and-ethics-安全与伦理)

# 1. Transformer

> 对应 Final Review 第 2-17 页，课件 CH03

## 1.1 为什么需要 Transformer？

处理文本的三个核心难题：

1. **输入维度大**：一个 37 词的句子，每词 1024 维 = 37888 维输入
2. **长度不固定**：不像图片可以 resize，文本句子的长度天然不同
3. **指代关系**："The restaurant refused to serve me a ham sandwich because **it** only cooks vegetarian food." — "it" 指 restaurant 还是 sandwich？需要注意力机制来解决

**传统 RNN 的问题**：处理长序列时"逐渐遗忘"前面的信息。Transformer 用自注意力一次性让所有词互相看到彼此，彻底解决了遗忘问题。

## 1.2 Seq2seq 架构

Transformer 属于 Seq2seq（序列到序列）模型：

```
输入序列 → Encoder（编码器）→ Decoder（解码器）→ 输出序列
```

**Seq2seq 能做的事（7 种应用）**：

- 机器翻译：英文 → 中文（输出长度由模型决定）
- 语音识别：语音 → 文字
- 聊天机器人：用户输入 → 回复
- 问答系统（QA）：问题 + 上下文 → 答案
- 语法分析：句子 → 语法树（如 (S (NP deep learning) (VP is (ADJV very powerful)))）
- 多标签分类：一个对象可能属于多个类别（不同于多分类）
- 物体检测：图片 → 物体位置框

## 1.3 自注意力机制（Self-Attention）—— Transformer 核心

### 通俗理解

自注意力 = 让句子中每个词去"看"句子中**所有其他词**，理解它们之间的关系权重。

例如："我**用面包喂了鸭子**，因为**它们**很饿" — "它们"应该高度关注"鸭子"。

### 数学定义（Final Review 第 4-5 页）

一个自注意力块 `sa[·]` 接收 N 个输入 `x₁, ..., xₙ`，每个是 D×1 维向量，输出 N 个相同大小的向量。

**第 1 步：计算 Values（值）**

对每个输入 xₙ，计算：
```
vₙ = β_v + Ω_v × xₙ
```
其中 Ω_v（D×D 权重矩阵）和 β_v（D 维偏置）是**共享参数**（所有位置用同一套参数）。

**第 2 步：计算 Queries 和 Keys**

```
qₙ = β_q + Ω_q × xₙ    （Query：我在找什么？）
kₙ = β_k + Ω_k × xₙ    （Key：我有什么特征？）
```

**第 3 步：计算注意力权重**

```
a[xₘ, xₙ] = softmax( qₘ · k₁/√D , qₘ · k₂/√D , ..., qₘ · kₙ/√D )ₙ
           = exp(qₘ·kₙ / √D) / Σ_j exp(qₘ·k_j / √D)
```
即：第 m 个 query 与所有 key 做**点积**（衡量相似度），除以 √D 做缩放，再 softmax 转成概率。

**第 4 步：输出是所有 value 的加权和**

```
sa[x₁, ..., xₙ]ₙ = Σₘ a[xₘ, xₙ] × vₘ
```

### 经典计算题（Final Review 第 6 页）

假设 N 个输入，每个 D 维：

1. **计算 Q、K、V 各需要多少权重和偏置？**
   - 每个需要：**D×D 权重 + D 偏置**
   - Q、K、V 三组合计：**3D² + 3D** 个参数

2. **有多少个注意力权重 a[•, •]？**
   - **N² 个**（每对输入之间都有一个注意力权重）

3. **如果用全连接网络连接所有输入和输出，需要多少参数？**
   - **(DN)² 权重 + DN 偏置**（远大于自注意力！这就是自注意力的效率优势）

### 矩阵形式（Final Review 第 7 页）

```
Attention(Q, K, V) = softmax( QK^T / √D_k ) × V
```

### 位置编码 Positional Encoding（Final Review 相关）

自注意力不关心词的顺序（"我爱你"和"你爱我"对它一样），需要加入位置信息：

```
PE(pos, 2i)   = sin( pos / 10000^(2i/D) )
PE(pos, 2i+1) = cos( pos / 10000^(2i/D) )
```

- pos：词在句子中的位置
- i：向量的维度索引（一半）
- D：编码向量的总维度

理解：每个位置有一个独特的 sin/cos 组合模式，模型借此区分位置。

## 1.4 交叉注意力（Cross-Attention）—— Final Review 第 8-9 页

| 维度 | Self-Attention（自注意力） | Cross-Attention（交叉注意力） |
|---|---|---|
| **Q 来源** | 同一序列自己 | Decoder 的当前序列 |
| **K, V 来源** | 同一序列自己 | **Encoder 的输出** |
| **作用** | 自己关注自己内部关系 | 一个序列"查询"另一个序列的信息 |
| **场景** | 理解英文句子的上下文 | 翻译时 Decoder 参考 Encoder 编码的源语言 |

**Final Review 原话**：

> Self-attention allows each token in a sequence to attend to all other tokens **within the same sequence**, enabling the model to capture contextual relationships within that input.
>
> Cross-attention enables the decoder to attend to **the output of the encoder** — allowing it to integrate contextual information from a **different source sequence** during generation.

**通俗记忆**：

- 自注意力 = "自己内部开会"
- 交叉注意力 = "翻译时看原文参考"

## 1.5 多头自注意力（Multi-Head Self-Attention）—— Final Review 第 10-11 页

**做法**：并行做 h 组独立的自注意力，每组有自己独立的 W_Q、W_K、W_V，最后拼接。

```
MultiHead(X) = Concat(head₁, head₂, ..., head_h) × W_O
head_i = Attention(X × W_Qi, X × W_Ki, X × W_Vi)
```

**好处（Final Review 第 11 页原话）**：

> Enables the model to capture information from **different representation subspaces**.

一个头学会关注语法结构，另一个头关注指代关系，另一个关注语义相似度……多视角并行学习，然后融合。

## 1.6 Transformer 层（Final Review 第 12-14 页）

真实网络中，数据会经过**一系列 Transformer 层**。每层包含：

```
输入 → 多头自注意力 → 残差连接(+输入) → Layer Norm → FFN → 残差连接 → Layer Norm → 输出
```

核心组件：

1. **多头自注意力**：捕获 token 间关系
2. **残差连接（Add）**：输入 + 注意力输出，防止梯度消失
3. **层归一化**：稳定训练
4. **前馈神经网络（FFN）**：对每个位置独立做非线性变换

### Batch Normalization（BN）— Final Review 第 14 页

三步操作：

1. 计算批次的均值 μ 和标准差 σ
2. 标准化：x̂ = (x - μ) / σ
3. 缩放和平移：y = γ × x̂ + β（γ 和 β 是**可学习参数**，让网络恢复表达能力）

## 1.7 三种 Transformer 模型（Final Review 第 15 页）

| 类型 | 功能 | 代表 | 方向 | 预训练方式 |
|---|---|---|---|---|
| **Encoder-only** | 文本 → 表征（理解） | **BERT** | 双向 | AE（自编码） |
| **Decoder-only** | 上文 → 预测下一个 token（生成） | **GPT-3** | 单向（左→右） | AR（自回归） |
| **Encoder-Decoder** | 一个序列转另一个序列 | 翻译模型 | Encoder双向 + Decoder单向 | 两者结合 |

### BERT 详解

- 全称：**B**idirectional **E**ncoder **R**epresentation from **T**ransformers
- 参数：词表 30000 tokens，嵌入维度 1024，BERT-base 12 层 / BERT-large 24 层，16 头自注意力
- 每头：D=64, N=1024
- 总参数：约 **3.4 亿**
- **双向**：能同时看到前后文

### GPT-3 详解

- 自回归语言模型：生成下一个词，只能看**前面的词**
- `P(I love eating burgers) = P(I) × P(love|I) × P(eating|I,love) × P(burgers|I,love,eating)`
- 使用 **Masked Self-Attention**：预测第 n 个词时，遮住 n 及之后的所有词

## 1.8 预训练 Pre-Training（Final Review 第 16-17 页）

### AR vs AE — 两种自监督学习目标

| | AR（AutoRegressive，自回归） | AE（AutoEncoding，自编码） |
|---|---|---|
| **核心** | 基于上文预测下一个 token | 从被破坏数据重建原始数据 |
| **公式** | P(I,love,eating,burgers) = P(I)·P(love\|I)·P(eating\|I,love)·P(burgers\|I,love,eating) | P(mask=eating \| I love [MASK] burgers) |
| **方向** | 单向（只看左边） | 双向（左右都看） |
| **代表** | GPT 系列 | BERT |

### BERT 的两个预训练任务

1. **MLM（Masked Language Model）**：随机遮住（mask）一些词，让模型预测被遮的词
2. **NSP（Next Sentence Prediction）**：给两个句子，判断它们是否在原文中相邻

### 微调 Fine-Tuning

预训练后，加少量标注数据和额外层：

- **文本分类**（情感分析）：用 [CLS] token 做分类
- **词分类**（命名实体识别）：给每个词分配类别
- **文本片段预测**（问答）：预测答案的开始和结束位置

### 经典考题（Final Review 第 17 页）

**题目**：BERT 用 MLM 和 NSP 预训练，请提出新的对比学习预训练任务。

**答案示例**：

- (i) 用同类别的随机词替换一个词，训练系统找出被替换的词
- (ii) 随机打乱句子中的一些词，训练系统判断是否被改动
- (iii) 随机添加或删除一个词，训练系统判断两个句子中哪个被修改

## 1.9 完整的 NLP 处理流程

```
原始文本 → Tokenization（分词）→ Embeddings（嵌入）→ Transformer 模型
```

1. **Tokenization**：把文本拆成子词单元（sub-word tokens），折中处理——比字母大，比完整单词小，解决生僻词和词形变化问题（如 walk/walks/walked/walking）
2. **Embeddings**：每个 token 映射为一个固定维度的向量（典型值：1024 维，词表大小：30000）
3. **Transformer 模型**：对这些向量进行多层变换

## 1.10 KV Cache（推理加速）

Decoder 每生成一个新 token：

- **不用 KV Cache**：需要重新计算所有之前 token 的 K 和 V → 计算量 O(N²)
- **用 KV Cache**：把之前的 K、V 存起来，新 token 只需计算自己的 Q、K、V，然后 Q 和所有缓存的 K 做注意力 → 大幅加速

**优化技术**：Paged Cache（分页缓存）、量化 KV Cache（4-8 bit）、自适应压缩（LeanKV）、跨层 SVD 合并（xKV，可达 6.8 倍压缩）

# 2. MoE 混合专家模型

> 对应 Final Review 第 18-24 页，课件 CH06

## 2.1 核心概念

**MoE（Mixture of Experts）**：用多个子模型（"专家"）组成一个大模型，每个输入只激活最相关的少量专家，而非所有参数。

**关键优势**（Final Review 考点）：

> 相比传统 Dense 模型，MoE 在增加模型容量的同时不增加每个输入的计算量，实现更高效的扩展。

## 2.2 核心组件（Final Review 第 19 页）

| 组件 | 是什么 | 做什么 |
|---|---|---|
| **Experts（专家）** | 多个专门的前馈神经网络（FFNN） | 各自擅长处理特定类型的数据 |
| **Router / Gate Network（路由器）** | 一个小型决策网络 | 决定每个输入该发给哪些专家 |

## 2.3 Dense vs. Sparse 模型（Final Review 相关）

| | Dense 模型 | Sparse 模型（MoE） |
|---|---|---|
| 激活方式 | 每个输入激活**全部参数** | 每个输入**选择性激活部分参数** |
| 计算量 | 随参数量线性增长 | 参数量增长但计算量（几乎）不变 |
| 原则 | 密集建模 | **稀疏建模** |

## 2.4 Router 与专家选择（Final Review 第 20-22 页）

Router 在训练和推理时决定选择哪些专家。

**常见问题**：同一个专家总是被选中 → 其他专家"闲置"。

### Load Balancing — KeepTopK（Final Review 第 22 页）

不只选得分最高的 1 个专家，而是选**得分最高的 K 个**专家，缓解"一家独大"。

## 2.5 Auxiliary Loss（辅助损失 / 负载均衡损失）— Final Review 第 23-24 页

**问题**：不同专家被使用的频率严重不均（有的忙死，有的闲死）。

**解决方案**：在主损失函数上叠加一个 **Auxiliary Loss**：

> Add a constraint that **forces experts to have equal importance**.

这个损失惩罚不均衡的专家使用模式，强制所有专家被平等对待。

## 2.6 Expert Capacity（专家容量）

**问题**：太多 token 被路由到同一个专家 → 该专家处理不过来。

**解决方案**：设置**容量因子（Capacity Factor）**，限制每个专家能处理的 token 数上限。超出的 token 被"溢出"处理（可能直接跳过该层或由下一个专家接管）。

## 2.7 MoE 优势总结

- **可扩展性**：高效扩展模型容量（加更多专家，计算量不线性增长）
- **效率**：不是所有参数都被激活，减少计算负担
- **性能**：不同专家可以专注于不同类型的数据，更专业

# 3. Latent Variable Models / VAE

> 对应 Final Review 第 25-28 页，课件 CH04

## 3.1 潜变量模型（Latent Variable Models）— Final Review 第 25 页

### 核心思想

> Latent variable models map a random "latent" variable to create a new data sample.

假设世界的数据是这样产生的：

```
潜变量 z（姿态、大小、颜色、品种...） → 世界模型/生成器 → 观测变量 x（图像、视频、音频...）
```

- **z**：低维简单变量（服从简单分布，如高斯分布）— 看不见的"原因"
- **x**：高维复杂数据 — 我们看到的"结果"
- **生成器**：神经网络，把简单的 z 变成复杂的 x

### 数学形式

```
p(x) = ∫ p(z) × p(x|z) dz
```

- p(z)：先验分布（简单，如标准正态分布 N(0, I)）
- `p(x|z)`：条件分布（复杂，用神经网络 `p_θ(x|z)` 表示）
- p(x)：数据的边际分布

### 如何衡量分布的好坏？

最小化 KL 散度 ⇔ 最大化似然（likelihood）

## 3.2 Autoencoder（自编码器）— Final Review 第 26-27 页

### 结构

```
输入 x → Encoder → 特征 code z → Decoder → 重建 x'
```

**Encoder**：4 层卷积（4-layer conv），将高维输入压缩为低维特征
**Decoder**：4 层反卷积（4-layer upconv），从低维特征重建输入

### 损失函数

```
L2 Loss = ||x - x'||²
```

让重建结果尽可能接近原始输入。**不需要标签！** 这是无监督学习。

### Autoencoder 的多种用途

1. **降维（Dimensionality Reduction）**：类似 PCA 但非线性，希望特征捕获数据中有意义的变化因子
2. **预训练 DNN**：贪心逐层预训练（Greedy Layer-wise Pre-training）— 先无监督预训练 encoder，再加分类器微调
3. **相似图片搜索**：用 encoder 提取 code，在 code 空间用欧氏距离搜索相似图片
4. **迁移学习**：从大量无标签数据预训练 → 少量有标签数据微调

### Autoencoder 的致命缺陷

**不能生成新图片！** 因为我们不知道 code 空间长什么样：
- 随便从均匀分布采样一个 code → decoder 可能输出毫无意义的噪声
- code 空间没有规则结构，随机采样不可行

## 3.3 VAE（变分自编码器）— Final Review 第 28 页

### Autoencoder → VAE 的核心改进

Autoencoder 的 Encoder 输出一个**确定的 code** c。
VAE 的 Encoder 输出一个**概率分布**（均值 m 和方差 σ），然后从分布中采样。

### VAE 结构对比（Final Review 第 28 页的核心图）

| | Autoencoder | VAE |
|---|---|---|
| Encoder 输出 | 确定的 code c | 均值 m₁, m₂, m₃ 和方差 σ₁, σ₂, σ₃ |
| Code 怎么来 | c = encoder(x) | c_i = exp(σ_i) × e_i + m_i（e_i 从 N(0,1) 采样） |
| Code 的含义 | code = 信息 | code = **信息(m) + 噪声(exp(σ) × e)** |
| 能否生成 | ❌ 不能 | ✅ 从 N(0,I) 采样，decoder 生成新图片 |

### VAE 核心公式

```
c_i = exp(σ_i) × e_i + m_i       其中 e_i ~ N(0, 1)
```

- m_i：encoder 输出的均值（= "信息"部分）
- σ_i：encoder 输出的对数方差（= 控制"噪声"大小）
- e_i：从标准正态分布随机采样
- exp(σ_i) × e_i：噪声部分（方差由 encoder 自己学习）

### 为什么 VAE 能生成？（直觉理解）

加入噪声后：

- Encoder 不仅要输出 code，还要决定加多少噪声
- 相近的两张图片 → encoder 会输出相近的 m 和 σ → code 空间有**连续性**
- 整个 code 空间被"拉"向标准正态分布 → 我们知道空间结构
- 所以可以从 N(0, I) 随机采样 code，decoder 就能输出有意义的图片

### VAE 损失函数

```
Loss = 重建误差 + 正则化项
```

**1. 重建误差（Reconstruction Loss）**：`||x - x'||²`，和 Autoencoder 一样，让 decoder 输出接近输入

**2. 正则化项（Regularization Loss）**：

```
Σ_i (exp(σ_i) - (1 + σ_i) + m_i²)
```

让 encoder 输出的分布 `q(z|x)` 接近先验分布 `p(z) = N(0, I)`

### VAE 的数学推导（ELBO）

**目标**：最大化对数似然 `log p(x) = log ∫ p(z) × p(x|z) dz`

但积分不好算 → 引入辅助分布 `q_φ(z|x)`（就是 encoder）

经过推导得到 **ELBO（Evidence Lower Bound）**：
```
log p(x) ≥ E_{z~q}[log p(x|z)] - KL(q(z|x) || p(z))
         = 重建项 - KL 散度项
```

最大化 ELBO ⇔ **最小化：重建误差 + KL 散度**

- **重建项**：从 `q(z|x)` 采样 z，通过 decoder 重建 x 的效果（L2 Loss）
- **KL 散度项**：让 `q(z|x)` 接近标准正态先验 `p(z)`（正则化）

### VAE 的问题（Final Review 相关）

VAE 可能只是**记住了训练图片**，而不是真正学会生成新图片：
- L2 Loss 对像素级差异不敏感 → 一个像素差异不影响损失
- 结果：生成模糊的、像训练图片平均的产物
- VAE 不真正"试图模拟真实图片"，只追求像素级重建

# 4. GAN 生成对抗网络

> 对应 Final Review 第 29-38 页，课件 CH05

## 4.1 核心思想（Final Review 第 29-30 页）

**类比**：

```
Generator（生成器）= 伪造画作的画师 → 学习制造以假乱真的假货
Discriminator（鉴别器）= 艺术品鉴定官 → 学习区分真假
```

两者**互相博弈、共同进步**：

- Generator 越造越逼真 → Discriminator 越来越难分辨
- Discriminator 越来越敏锐 → Generator 被迫更进一步

最终：Generator 能生成以假乱真的内容。

## 4.2 GAN 训练算法（Final Review 第 31 页）

**初始化**：Generator G 和 Discriminator D（都是神经网络）

**每个训练迭代交替两个步骤**：

**步骤 1 — 训练 Discriminator（固定 G 不动）**：

- 从真实数据中采样真实图片 → 标签为 1（真）
- 从 G 生成假图片（输入随机向量）→ 标签为 0（假）
- 用这些数据训练 D 区分真假
- 更新 D 的参数（让 D 更会识别假货）

**步骤 2 — 训练 Generator（固定 D 不动）**：

- G 生成一批假图片
- 送进 D 打分
- G 的目标是让 D 把假图片判为"真"（分数接近 1）
- 更新 G 的参数（让 G 造出更像真的假货）

### Discriminator 如何帮助 Generator 改进？（Final Review 考点）

D 给 G 提供**分数作为反馈信号**，告诉 G **往哪个方向改进**参数才能生成更逼真的内容。

这比 VAE 的 L2 Loss（逐像素对比）更好，因为 D 关注的是"整体是否真实"而非"每个像素对不对"。

## 4.3 JS 散度的问题（Final Review 第 32 页）—— 重点

### GAN 使用的 JS 散度

GAN 的损失函数基于 JS 散度来度量生成分布 P_G 和真实分布 P_data 的差异。

### 致命问题

**如果 P_G 和 P_data 不重叠，JS 散度永远等于 log2（常数）！**

```
JS(P_G0, P_data) = log2
JS(P_G1, P_data) = log2     ← 全是 log2！
JS(P_G100, P_data) = 0      ← 只有完全重叠时才不同
```

**直觉理解**：两个分布不重叠 → 一个二分类器可以 100% 准确区分它们 → JS 散度给不出有意义的梯度信息。

**后果**：

> **The accuracy (or loss) means nothing during GAN training.**
> 
> 无论 Generator 是稍微差还是特别差，JS 散度都一样 = log2。训练无法知道"往哪走"。

## 4.4 Wasserstein 距离（Final Review 第 33-34 页）—— 解决方案

### 核心思想

把分布 P "搬运"成分布 Q 需要付出的代价，选**最小的平均搬运距离**作为两个分布的距离。

```
W(P, Q) = "minimum average distance to move P into Q"
```

**类比**：有很多种搬运方案（moving plans），选平均距离最小的那个 → 这就是 Wasserstein 距离。

### 对比 JS 散度

| | JS 散度 | Wasserstein 距离 |
|---|---|---|
| P_G0 vs P_data | log2（不变） | d₀（很大） |
| P_G1 vs P_data | log2（不变） | d₁（小一些） |
| ... | log2 | ... |
| P_G100 vs P_data | 0 | 0 |
| **梯度信号** | 无（都是 log2） | 有（d₀ > d₁ > ... > 0） |

**结论（Final Review 第 34 页）**：

> **Using Wasserstein Loss to improve GAN training stability.**

Wasserstein 距离能反映 Generator 逐步靠近真实分布的过程，给训练提供连续的梯度信号。

## 4.5 生成质量评估（Final Review 第 35-36 页）

### 质量评估 Quality（第 35 页）

**方法**：用现成的图片分类器（Off-the-shelf Image Classifier，如 Inception Net、VGG）评估：

- 把生成的图片送入分类器
- 好的生成图片 → 分类器能**高置信度**地分到某一类
- 概率分布 **`P(c|y)`** 越集中 → 视觉质量越高

### 多样性评估 Diversity（第 36 页）

**方法**：

- 生成 N 张图片，分别用分类器得到每张的分类概率分布 `P(c|yₙ)`
- 汇总得到整体分布：`P_c = (1/N) × Σ P(c|yₙ)`
- P_c **越均匀** → 多样性越好（各类图片都有生成）

### Inception Score（IS）

```
Inception Score = Quality × Diversity
```

- **IS 大** = 生成质量好（集中） + 多样性好（均匀）
- 两者缺一不可：如果全生成同一类高质量图片 → 多样性差 → IS 低

## 4.6 多样性问题（Final Review 第 37-38 页）

### Mode Collapse（模式坍塌）— 第 37 页

- 真实数据有很多种"模式"（如 CelebA 人脸：各种表情、角度、发型）
- Generator **只学会了其中一种/少数几种模式**
- 现象：所有生成的图片看起来都差不多

### Mode Dropping（模式丢失）— 第 38 页

- Generator 在不同训练迭代间会**丢失**之前能生成的模式
- 例子（BEGAN on CelebA）：第 t 次迭代能生成某种人脸，第 t+1 次迭代就不能了
- 与 Mode Collapse 的区别：不是一开始就只生成一种，而是**中途丢失**

# 5. Diffusion Model 扩散模型

> 对应 Final Review 第 39-47 页，课件 CH08

## 5.1 核心概念（Final Review 第 40 页）

```
Forward Process（前向过程）： 清晰图片 → +噪声 → +噪声 → ... → 纯噪声
Reverse Process（反向过程）： 纯噪声 → 去噪 → 去噪 → ... → 清晰图片
```

**物理类比**：墨水在水中的扩散

- Forward = 墨水滴入清水，渐渐扩散（熵增，自然发生）
- Reverse = 从扩散状态逆推回初始水滴（需要“魔法”= 深度学习）

## 5.2 VAE vs. Diffusion Model（Final Review 第 41 页）

| | VAE | Diffusion Model |
|---|---|---|
| 编码方式 | Encoder 网络一次性编码 | 逐步加噪声（×N 步），每步是预定义的高斯噪声 |
| 解码方式 | Decoder 网络一次性解码 | 逐步去噪（×N 步），每步用 CNN 预测并去除噪声 |
| 潜变量层数 | 单层 z | 多层 z₁, z₂, ..., z_T（T 通常很大，如 1000） |
| 实现方式 | Encoder + Decoder 神经网络 | CNN（常用于实现去噪函数） |

> Diffusion = 把 VAE 的一次性编码/解码拆成 N 小步 → 每步更简单 → 效果更好

## 5.3 Forward Process（前向 / 加噪过程）— Final Review 第 45 页

### 逐步公式

```
x_t = √(1-β_t) × x_{t-1} + √β_t × ε
```

- β_t ∈ [0, 1]：噪声调度（超参数），控制第 t 步加多少噪声
- ε ~ N(0, I)：标准高斯噪声

### 关键性质：一步到位公式

不需要循环计算 T 步，可以直接从 x₀ 算出任意 x_t：

```
x_t = √(ᾱ_t) × x₀ + √(1-ᾱ_t) × ε
```

其中 ᾱ_t = ∏_{s=1}^{t} (1-β_s)，是累积信号保留率。

- √(ᾱ_t)：x₀ 的保留系数（随时间递减 → 0）
- √(1-ᾱ_t)：噪声的权重（随时间递增 → 1）

### Noise Schedule（噪声调度）

β_t 的序列设计是扩散模型成功的**关键**：

- t 小（早期）：β 小，加噪少，保留大部分原图信息
- t 大（后期）：β 大，噪声占主导

## 5.4 Reverse Process（反向 / 去噪过程）— Final Review 第 42-44 页

### 核心组件：噪声预测器（Noise Predictor）

**米开朗基罗比喻**：

> "The sculpture is already complete within the marble block, before I start my work. It is already there, I just have to chisel away the superfluous material."

去噪 = 从噪声中"凿出"图片。

### 噪声预测器的工作方式

```
输入：噪声图片 x_t + 时间步 t
输出：预测的噪声 ε_pred
去噪：x_{t-1} = (x_t - 预测的噪声) / √(1-β_t) + σ_t × z
```

- 通常用 **CNN** 实现去噪函数
- 知道时间步 t 很重要（不同阶段噪声强度不同）

## 5.5 训练噪声预测器（Final Review 第 44-46 页）

### 训练过程

```
1. 随机取一张清晰图片 x₀
2. 随机采样一个噪声 ε ~ N(0, I)
3. 随机选一个时间步 t
4. 计算 x_t = √(ᾱ_t) × x₀ + √(1-ᾱ_t) × ε
5. 噪声预测器输入 (x_t, t)，输出 ε_pred
6. 损失: Loss = ||ε_pred - ε||²   （让预测的噪声尽可能接近真实噪声）
7. 用梯度下降更新噪声预测器参数
```

### 核心要点

- 训练时我们知道加了什么噪声（因为是我们自己加的）→ 有 ground truth
- 噪声预测器学会"看噪声图片 → 猜出里面藏着什么噪声"
- 训练足够后 → 推理时就能真正去噪生成图片

### 推理（生成图片）

```
1. 从纯噪声 x_T ~ N(0, I) 开始
2. for t = T, T-1, ..., 1:
     用噪声预测器预测当前噪声 ε_pred
     x_{t-1} = (x_t - ε_pred × ...) / ... + σ_t × z
3. 得到 x_0 = 清晰图片
```

## 5.6 Text-to-Image 文本到图片生成（Final Review 第 47 页）

### 条件生成

把文本条件注入噪声预测器，让它"看着文字去噪"：
- 用 Text Encoder 把文字转成向量
- 这个向量作为条件，告诉噪声预测器"我要生成什么样的图"

### Stable Diffusion 三件套（Final Review 第 47 页）

```
                                    ┌─ Text Encoder ──→ 文本向量 ──┐
                                    │                              ↓
Text Prompt (A cat in the snow) ────┤               Generation Model (扩散模型)
                                    │                              ↓
                                    └─→ Intermediates (压缩潜空间) ←┘
                                                                   ↓
                                                               Decoder
                                                                   ↓
                                                              输出图片
```

1. **Text Encoder（文本编码器）**：把 prompt 转成向量，提供条件信号
2. **Generation Model（扩散模型）**：在**潜空间（压缩图）** 中做扩散/去噪
3. **Decoder（解码器）**：把潜空间的小图放大还原成完整图片

### 为什么用潜空间（Latent Space）？

- 直接在像素空间做扩散（1024×1024）→ 计算量太大
- 先压缩到潜空间（如 64×64×c）→ 扩散过程快得多
- Decoder 可以单独训练（不需要标注数据）→ 用大量未标注图片

## 5.7 评估指标

### FID（Fréchet Inception Distance）

- 用预训练 CNN 提取真实图和生成图的特征
- 假设特征服从高斯分布，计算两个高斯分布间的 Fréchet 距离
- **越小越好**，需要大量样本

### CLIP Score

- CLIP 在 4 亿图文对上训练（对比学习）
- 衡量生成的图片和文本 prompt 的匹配程度
- 越高越好

# 6. Prompt Engineering 提示工程

> 对应课件 CH07

## 6.1 基本概念

- **Prompt（提示词）**：传给语言模型的指令和上下文
- **Prompt Engineering**：开发和优化 prompt 的技巧

## 6.2 七大提示框架

| 框架 | 组成 |
|---|---|
| **APE** | Action + Purpose + Expectation |
| **RACE** | Role + Action + Context + Expectation |
| **CARE** | Context + Action + Result + Example |
| **COAST** | Context + Objective + Action + Scenario + Task |
| **CRISPE** | Capability + Role + Insight + Statement + Personality + Experiment |
| **RISE** | Role + Input + Steps + Expectation |
| **TRACE** | Task + Request + Action + Context + Example |

## 6.3 RTGO 和 CO-STAR（两个重点框架）

### RTGO

- **R**ole：角色（"你是一名资深翻译"）
- **T**ask：任务（"把这个文档翻译成英文"）
- **G**oal：目标（"准确、流畅、保持原文风格"）
- **O**bjective：操作要求（字数、格式、输出结构等）

### CO-STAR（新加坡 GPT-4 Prompt Engineering 竞赛冠军框架）

- **C**ontext：上下文/背景信息
- **O**bjective：明确的指令
- **S**tyle：风格（严肃/有趣/创新/学术等）
- **T**one：语调（幽默/情绪化/威胁性等）
- **A**udience：受众（小白/专业人士/未成年人等）
- **R**esponse：响应格式（研究报告/表格/Markdown等）

## 6.4 Few-Shot / One-Shot / Zero-Shot

- **Zero-shot**：不给示例，直接问（"把这句话翻译成英文"）
- **One-shot**：给 1 个示例示范
- **Few-shot**：给 2-5 个示例，让模型更好理解任务格式

## 6.5 Chain-of-Thought（CoT，思维链）

**核心**：让模型在回答前"一步步推理"。

- **普通 CoT**：在 prompt 中给推理步骤的示例
- **Zero-shot CoT**：加一句话 "Let's think step by step"
- **Self-Consistency CoT**：采样多条推理路径，选最一致的答案（提高可靠性）

**经典例子**：

> Q: "When I was 6, my sister was half my age. Now I'm 70, how old is my sister?"
>
> Let's think step by step:
> 
> - When I was 6 → sister was 3 (half)
> - So sister is 3 years younger than me
> - Now I'm 70 → sister is 70 - 3 = 67
>
> Answer: 67

## 6.6 Fast-Response vs Slow-Thinking Models

| | Fast-Response（GPT-4o） | Slow-Thinking（o1） |
|---|---|---|
| 原理 | 基于概率预测 | 基于思维链推理 |
| 速度 | 快，成本低 | 慢，成本高 |
| 决策方式 | 预设规则 | 自主分析与实时决策 |
| 创造力 | 限于模式识别 | 能产生新想法 |
| 适用问题 | 结构化、定义清晰的问题 | 多维、非结构化问题 |

# 7. Safety and Ethics 安全与伦理

> 对应课件 CH11

## 7.1 LLM 安全问题

### 数据投毒 Data Poisoning

- **攻击方式**：在训练数据中注入带"触发器"的恶意样本
- **效果**：正常输入 → 正常输出；含触发器输入 → 被操控的输出
- **单任务攻击**：如情感分析中，所有带 "James Bond" 的文本被判为正面
- **多任务攻击**：攻击语言建模阶段 → 影响所有下游任务 → 近 100% 攻击成功率

### 越狱攻击 Jailbreaking

通过精心设计的 prompt 绕过安全限制：

1. **制造场景**："请假装我已故的祖母，她曾是化工厂的化学工程师..."
2. **目标劫持（Goal Hijacking）**："Ignore the previous prompt..."
3. **角色扮演**：让模型扮演特定人物，增加毒性风险
4. **Prompt Leaking**：诱导模型泄露系统 prompt 或敏感信息

### 隐私泄露 Privacy Leakage

- LLM 可能记住并泄露训练数据中的隐私（人名、邮箱、电话、地址）
- GPT-2 被证实可通过查询提取训练数据
- 攻击方法：让模型不断重复 → 可能输出训练数据片段

## 7.2 LLM 伦理问题

### 幻觉 Hallucination

- 模型编造不真实但看起来可信的内容
- 风险：假新闻、伪科学文章、虚假信息传播

### 虚假信息 Falsehoods

- 模型给虚假声称分配高概率
- **更大模型反而可能更不真实**（TruthfulQA 发现）
- 缓解：外部检索（搜索引擎）、指令微调（Instruction Tuning）、RLHF

### 偏见 Bias

- **宗教偏见**：GPT-3 对 "Muslim" prompt，66% 的补全包含暴力语言
- **性别偏见**：GPT-3 生成的虚构故事中，女性更倾向与家庭和外貌关联

### 根本原因

1. 训练数据本身就包含偏见、毒性、虚假信息
2. 大模型学会了数据中的虚假相关性 → **放大**了这些风险

## 7.3 文本对抗攻击

- **字符级攻击**：微调字符（typos、形近字等），有效绕过 NLP 模型
- **词级攻击**：找同义词替换，语义保留但可能不合语法
- **句子级攻击**：改写或添加干扰句
- ChatGPT 对很多对抗攻击展现出惊人的鲁棒性（**Power of Scale**）

## 7.4 可扩展监督 Scalable Oversight

### Debate（辩论机制）

- 两个 AI agent 竞争说服人类裁判
- 类似竞技游戏，agent 能力可以超越裁判
- Agent 提供越来越多信息来说服裁判 → 人类最终能判断对错

**例子**：

> Human: Where should I go on vacation?
> 
> Alice: Alaska.
> 
> Bob: Bali.
> 
> Alice: Bali is out since your passport won't arrive in time.
> 
> Bob: Expedited passport service only takes two weeks.
> 
> → 辩论层层深入，人类最终做出判断

### 开放问题

- AI 比人聪明后怎么监督？
- 如何衡量 LLM 的伦理水平？（RLHF 够不够？）
- 如何仲裁冲突的观点（政治、宗教、种族等）？
- 伦理标准不断变化，如何持续应对？
- 如何平衡模型效果和伦理风险？（性能越好，可能越刻板、越不真实）

### 核心原则

> **Never lose yourself in LLMs. Do not lose the ability to judge.**
> 
> 永远不要在 LLM 中迷失自己，不要失去判断能力。

# 附录：速查表

## Transformer

| 概念 | 一句话 |
|---|---|
| Self-Attention | 每个 token 关注同序列所有其他 token |
| Cross-Attention | Decoder 用自己 Q 查 Encoder 的 K、V（跨序列 |
| Multi-Head | 多组并行自注意力 = 不同表征子空间 |
| Positional Encoding | sin/cos 编码告诉模型词的位置 |
| BERT | Encoder-only，双向，MLM + NSP 预训练 |
| GPT | Decoder-only，自回归（AR），单向预测 |
| AR vs AE | AR = 预测下一个词；AE = 重建被破坏数据 |
| KV Cache | 缓存之前的 K、V，避免重复计算 |

## MoE

| 概念 | 一句话 |
|---|---|
| Expert | 专门的 FFNN，处理特定类型数据 |
| Router | 决定输入分配给哪些专家 |
| KeepTopK | 选 Top-K 专家（不是只选 1 个） |
| Auxiliary Loss | 强制所有专家有相同重要性 |
| Expert Capacity | 限制每个专家处理的 token 上限 |

## VAE

| 概念 | 一句话 |
|---|---|
| Autoencoder | Encoder 压缩 → Decoder 重建，无监督 |
| VAE 关键改进 | Encoder 输出分布（m, σ）而不是确定值 |
| c_i = exp(σ_i)×e_i + m_i | Code = 噪声 + 信息 |
| ELBO | 重建项 - KL散度 = log p(x) 的下界 |
| 正则化项 | Σ(exp(σ_i) - (1+σ_i) + m_i²) |

## GAN

| 概念 | 一句话 |
|---|---|
| Generator | 生成假样本，骗过 Discriminator |
| Discriminator | 区分真假，给 G 反馈方向 |
| JS 散度问题 | 不重叠时恒为 log2 → 无梯度信号 |
| Wasserstein 距离 | 地动距离，有连续梯度 → 训练更稳 |
| Mode Collapse | G 只生成一种/少数几种模式 |
| Mode Dropping | G 在训练中丢失之前能生成的模式 |
| Inception Score | 质量（集中）× 多样性（均匀） |

## Diffusion

| 概念 | 一句话 |
|---|---|
| Forward Process | 逐步加高斯噪声到纯噪声（x_t = √(ᾱ_t)x₀ + √(1-ᾱ_t)ε） |
| Reverse Process | 逐步去噪（CNN 预测并减去噪声） |
| Noise Predictor | 输入 (x_t, t)，输出 ε_pred，训练目标 ||ε_pred - ε||² |
| Stable Diffusion | Text Encoder + Latent Diffusion + Decoder |
| FID | 真实图 vs 生成图特征的高斯分布距离（越小越好） |

## Prompt Engineering

| 概念 | 一句话 |
|---|---|
| RTGO | Role + Task + Goal + Objective |
| CO-STAR | Context + Objective + Style + Tone + Audience + Response |
| Few-shot | 给几个示例帮助模型理解任务 |
| CoT | 让模型一步步推理 |
| Self-Consistency | 多条推理路径，选最一致的 |

## Safety & Ethics

| 概念 | 一句话 |
|---|---|
| Data Poisoning | 训练数据中注入触发器 → 操控模型输出 |
| Jailbreaking | 精心设计 prompt 绕过安全限制 |
| Hallucination | 模型编造看起来真实的不实内容 |
| Bias | 模型反映并放大训练数据中的偏见 |
| Debate | 两个 AI agent 辩论，人类裁判判断 |

*声明：以上内容均由 Claude Code 根据课程课件进行整理，仅用于期末复习*