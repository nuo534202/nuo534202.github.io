---
layout: post
title: "Chapter 01｜程序设计基础：代码题与代码阅读"
tags: [HKU MSc CS, 编程]
permalink: /hku_cs/chapter01_programming_basics.html
---
> **目标**：手写基础 Python 代码；读懂 C/Python 代码输出；完成进制、数位、数组、字符串与时间转换。  
> **优先级：A（必会）**｜建议 60–90 分钟。近期笔经多次出现基础编程、读代码、字符串与格式转换。

> **V2 版本说明**：以你上传的真题/笔经为核心，补充对应题型、完整解法与适当进阶。标注 **【真题补全】** 为资料直接涉及的考点；标注 **【拓展】** 为额外提高题；个别原资料答案如有问题会说明。

## 1. 考场必备语法

| 知识点 | 必须掌握 |
|---|---|
| 输入与输出 | `int(input())`、`list(map(int,input().split()))`、`print(x)` |
| 数据类型 | `int`、`float`、`bool`、`str`、`list`、`dict`、`set` |
| 分支循环 | `if/elif/else`、`for`、`while`、`break`、`continue` |
| 运算 | `/` 浮点除法、`//` 向下取整、`%` 取模、`**` 幂、`==` 比较 |
| 字符串 | `s[::-1]` 反转，`s[1:-1]` 去掉首尾，`"".join(parts)` 拼接 |
| 函数 | `return` 结束函数并返回值；`print` 只输出 |
| C/C++ 读码 | 整数除法截断、`unsigned`、整数溢出、`++i/i++`、`=` 与 `==` |

**读代码四步**：列初始变量 → 逐轮更新 → 检查循环终止 → 只记录实际输出。变量表比心算可靠。

```python
x, y = 5, 3
while x > 0:
    y += x
    x -= 1
print(y)               # 18 = 3+5+4+3+2+1
```

**边界条件**：零、负数、空数组、长度为 1、重复值、输入是否持续到负数、是否要输出每种结果。Python `bool` 可参与求和：`sum(x > 0 for x in a)` 是正数个数。

## 2. 整数、数位与进制

### 2.1 数位处理（A）

- 个位 `n % 10`；去掉个位 `n // 10`；第 k 个十进制位置用 `10**k`。
- 对正整数，恰好七位为 `10**6 <= n < 10**7`。
- `0` 的十进制位数为 **1**，循环统计要特殊处理。
- 注意题目“第 4 位”究竟从左数还是右数，以及下标是否从 0 开始。

```python
def digits(n):
    n = abs(n)
    if n == 0:
        return 1
    count = 0
    while n:
        n //= 10
        count += 1
    return count
```

### 2.2 十进制与二进制互转（A）

十进制转二进制：连续除以 2，记录余数，再**倒序**输出；`0` 特判。

```python
def to_binary(n):
    if n == 0:
        return "0"
    if n < 0:
        return "-" + to_binary(-n)
    ans = []
    while n:
        ans.append(str(n % 2))
        n //= 2
    return "".join(ans[::-1])

assert to_binary(12) == "1100"
```

二进制转十进制：从左到右做 `result = result * 2 + int(bit)`。`1100₂=12₁₀`。复杂度都按**位数**计。

### 2.3 奇偶、质数、约数（A/B）

- 偶数 `n % 2 == 0`；质数必须 `n >= 2`。
- 判断是否为质数，只需试除到 `d*d <= n`，复杂度 `O(√n)`。
- 完全数：所有**真因子**之和等于原数，例如 `6=1+2+3`。
- 欧几里得算法：`gcd(a,b)=gcd(b,a%b)`，`lcm(a,b)=abs(a*b)//gcd(a,b)`（当 `a,b` 非零）。
- 若题目已给 `is_prime()`，直接调用，避免重复实现。

```python
def is_prime(n):
    if n < 2:
        return False
    d = 2
    while d*d <= n:
        if n % d == 0:
            return False
        d += 1
    return True
```

### 2.4 整数转罗马数字（A）

从大到小依次扣除，特别记住：`4=IV, 9=IX, 40=XL, 90=XC, 400=CD, 900=CM`。

```python
def roman(n):
    pairs = [(1000,"M"), (900,"CM"), (500,"D"), (400,"CD"),
             (100,"C"), (90,"XC"), (50,"L"), (40,"XL"),
             (10,"X"), (9,"IX"), (5,"V"), (4,"IV"), (1,"I")]
    out = []
    for value, char in pairs:
        k, n = divmod(n, value)
        out.append(char * k)
    return "".join(out)   # 标准题通常 1 <= n <= 3999
```

**注意**：若题干规定“字符所对应数字相加等于输入值”，而不要求标准罗马数字表示，必须遵守**具体题意**，不要硬套减法表示。


## 3. 数组、矩阵与字符串（A）

### 数组必会操作

```python
nums = [3, 7, 2, 9, 1, 5, 8]
total = sum(nums)
lo, hi = min(nums), max(nums)
filtered = [x for x in nums if x != lo and x != hi]
# [3, 7, 2, 5, 8]：过滤的是所有等于极值的值
alternating = sum(nums[::2]) - sum(nums[1::2])
```

计数“比前一个元素大”的元素，只有 `i=1..n-1` 可以比较：

```python
def count_rises(nums):
    return sum(nums[i] > nums[i-1] for i in range(1, len(nums)))
```

- 找最大值与次大值：一次扫描维护两个候选；提前确认“次大值”是否必须**严格小于**最大值。
- 找缺失数字：如果范围为 `1..n`、恰少一个且无重复，使用总和差；否则考虑计数或集合。
- 相邻元素比较：必须明确是 **`>` 还是 `>=`**。
- 二维数组：`for row in matrix: for value in row:`；矩阵行和、列和、主副对角线分别计算。幻方通常还需要检查元素不重复。

### 字符串必会操作

| 目的 | Python |
|---|---|
| 字母频次 | `count[c] = count.get(c,0) + 1` |
| 反转 | `s[::-1]` |
| 元音字母判断 | `c.lower() in "aeiou"` |
| 大小写规范化 | `s.lower()` |
| 去首尾字符 | `s[1:-1]` |
| 结果拼接 | `"".join(parts)` |

**字符串逐层缩短题**（笔经出现过变体）：

```python
def shrink_lines(s):
    out = []
    while s:
        out.append(s + s[::-1])
        s = s[1:-1]
    return out

assert shrink_lines("abc") == ["abccba", "bb"]
```

题目样例若与文字规则冲突，优先核对考卷的**完整输出格式和终止条件**；网上回忆的输出也可能有误。

### 日期与时间转换（A）

12 小时制转 24 小时制：
- `12:xx am` 是 `00:xx`；`12:xx pm` 是 `12:xx`。
- 其他 `pm` 加 12，其他 `am` 不加。
- 加减 `d` 小时时：`(h+d)%24`；`HHMM` 用 `f"{h:02d}{m:02d}"`。

```python
def convert_12h(time4, suffix, delta_hours):
    h, m = int(time4[:2]), int(time4[2:])
    h = h % 12 + (12 if suffix.lower() == "pm" else 0)
    h = (h + delta_hours) % 24
    return f"{h:02d}{m:02d}"
```

**资料纠错提示**：某份笔经“`0145 am` 加 3 小时 → `1645`”与运算规则矛盾；严格加 3 小时应为 `0445`。若题目是跨时区转换，先确定时差的**正负方向**。

## 4. 典型代码题如何选套路（B）

| 题型 | 应试思路 | 最易错之处 |
|---|---|---|
| 杨辉三角 | 边缘是 1，中间是上一行相邻两数之和 | 行号、下标 |
| 拼接出最大整数 | 比较字符串 `a+b` 和 `b+a` 的字典序 | 不能直接按整数大小排 |
| 最大乘积数对 | 比较最大的两数与最小的两负数的乘积 | 忽视负数 |
| 单峰数组 | 先严格上升，再严格下降 | 平台、峰在端点 |
| 字符串数字求和 | 连续数字解析成一个整数 | 错将 `12` 算作 `1+2` |
| 整数拆分与全排列 | 递归选择，再撤销选择 | 重复结果、递归停止 |
| 区间筛选与合并 | 先筛选或排序，再遍历更新 | 区间端点开闭 |

滑动窗口、递归/回溯、三数之和、课程表、动态规划的完整实现见 **Chapter 03**。

## 5. 考试必查与口头解释

- **复杂度**：遍历数组 `O(n)`；二分查找 `O(log n)`；双层完整循环通常 `O(n²)`。
- **输入输出**：题目要求输出每组结果就不能只 `return` 一个总数；注意空格、换行、排序顺序、是否包含边界。
- **边界**：`n=0`、`n=1`、空列表、负数、重复数字、闰日/跨日、字符串只剩一个字符。
- **英文一句话**：*“I scan the input once, update the answer whenever the condition holds, and handle empty input separately.”*

## 6. 迷你自测

1. `n=1200`，每轮执行 `n//=10` 直至为零，共几轮？  
2. `nums=[2,7,5,8]`，偶数下标加、奇数下标减，输出多少？  
3. `29` 的二进制与罗马数字分别是什么？  
4. `is_prime(1)`、`is_prime(2)` 分别返回什么？

**答案**：①4；②`2-7+5-8=-8`；③`11101`、`XXIX`；④`False`、`True`。

**掌握标准**：能在纸上独立写出二进制转换、质数判断、数组扫描、字符串缩短和时间格式转换；能解释复杂度与边界情况。

---

## V2｜原始资料真题补全

### 1. 数论与整数判定：写出能运行的程序（【真题补全】）

**真实题型来源**：2020 题库“0–1000 中缺一个数”；2022 年 11 月 29 日正式卷“反复输入 `k` 并输出第 k 个质数”；2023 年 2 月题库 `n=a²+b⁵`；编程题汇总的完全数、`a²+b³`、质因子 `f/f+2`；26Fall 的阶乘列表。

1. **缺失数字**：题目给出 `0,1,...,1000` 中 1000 个互异数，唯独缺一个；总和 `1000*1001//2` 减实际和即答案。时间 `O(n)`，额外空间 `O(1)`。异或 `0^1^...^1000^a[0]^...` 同样 `O(n)/O(1)`，能避免固定宽整数累加溢出。
2. **第 k 个质数**：`1` 不是质数，`2` 是最小质数；逐个判断候选数直至找到 k 个。判断时只试除 `2..⌊√n⌋`，遇到因数立刻返回 `False`；`k<=0` 终止重复输入。
3. **完全数 Perfect Number**：一个正整数的所有**真因子**（不包括自身）之和等于该数，如 6、28、496、8128。试除到平方根，成对加入因子，注意完全平方数的平方根不能加两遍；第 k 个完全数从 2 开始枚举直到计数达 k（朴素算法只适合小 k）。
4. **特殊整数**：不同笔经出现 `n=a²+b³` 和 `n=a²+b⁵` 等**不同定义**；首先按照题干确定幂次和 `a,b` 的正整数条件，而不是背某个固定答案。枚举 `a`、判断剩余是否为正整数的立方/五次方，或对正整数 b 直接枚举，均可求解。
5. **“存在因子 f 和 f+2，且两个数均为质数”**：枚举素数 f，检查 `n%f==0` 且 `n%(f+2)==0` 及 `is_prime(f+2)`；这是“两因子”，不一定要求 `n=f(f+2)`。
6. **阶乘列表**：例如 `n=5` 输出 `[1,2,6,24,120]`。用 `fact*=i` 逐项追加即可，`n=0` 返回空列表，时间 `O(n)`，不需要每次重算阶乘。

```python
from math import isqrt

def missing_zero_to_n(nums, n):
    # nums 恰好来自 0..n，且只少一个，不重复
    return n * (n + 1) // 2 - sum(nums)

def is_prime(n):
    if n < 2:
        return False
    for d in range(2, isqrt(n) + 1):
        if n % d == 0:
            return False
    return True

def kth_prime(k):
    if k < 1:
        raise ValueError("k must be positive")
    found, value = 0, 1
    while found < k:
        value += 1
        found += is_prime(value)
    return value

def is_perfect(n):
    if n < 2:
        return False
    s = 1
    for d in range(2, isqrt(n) + 1):
        if n % d == 0:
            s += d
            if d != n // d:
                s += n // d
    return s == n

def is_a2_plus_bpower(n, exponent=5):
    # a,b 为正整数；判定 n=a²+b^exponent
    for b in range(1, n + 1):
        power = b ** exponent
        if power >= n:
            break
        rest = n - power
        a = isqrt(rest)
        if a >= 1 and a * a == rest:
            return True
    return False

def factorial_list(n):
    ans, fact = [], 1
    for i in range(1, n + 1):
        fact *= i
        ans.append(fact)
    return ans

assert missing_zero_to_n([0, 1, 3], 3) == 2
assert kth_prime(6) == 13 and is_perfect(28)
assert is_a2_plus_bpower(33, 5)  # 1²+2⁵
assert factorial_list(5) == [1,2,6,24,120]
```

**时间复杂度辨析**：单次试除法 `O(√n)`；反复枚举第 k 个质数的总时间不能简单写为 `O(k)`，因为每个候选数还要做质数判断，且第 k 个质数的位置并不等于 k。

### 2. GCD / LCM / 扩展欧几里得（【资料回忆：现场技术问答】）

- `gcd(a,b)=gcd(b,a%b)`，直到 b=0；使用绝对值处理负数。
- `lcm(a,b)=|ab|/gcd(a,b)`（二者非零），在固定宽整数语言中先除后乘以减小溢出风险。
- Extended GCD 要求同时找到 `x,y`，使 `ax+by=gcd(a,b)`，可用于解同余/模逆元。
```python
def gcd(a, b):
    a, b = abs(a), abs(b)
    while b:
        a, b = b, a % b
    return a

def egcd(a, b):
    if b == 0:
        return a, 1, 0
    g, x1, y1 = egcd(b, a % b)
    return g, y1, x1 - (a // b) * y1

assert gcd(30,18) == 6
g,x,y = egcd(30,18)
assert 30*x + 18*y == g == 6
```

### 3. 数位、进制、位运算和格式化（【真题补全】）

- **整数位数**：正数 `while n: n//=10; cnt+=1`；`0` 通常定义为 1 位，负号不计入十进制数字位数。26Fall 正式批的大整数 `123456789012345` → **15 位**。
- **七位数第 4 位是 0**：若从左往右数，第 4 位可写 `n//1000 % 10`，且 `1_000_000<=n<=9_999_999`（如 1230456 的第 4 位是 0）；如题目从右边数要调整。
- **二进制**：`n%2` 获取最低位，`n//=2` 右移一位；收集余数后反转。负数的补码表示依赖位宽，不可简单用字符串加负号当作机器补码。
- **lowbit**：对正整数 `x`，`x & -x` 保留二进制最低位的 1，例如 `12 (1100₂) → 4 (0100₂)`；用于 Fenwick Tree/树状数组。
- **ASCII / Unicode / UTF-8**：ASCII 基本字符 0–127；Unicode 为字符分配码点，UTF-8 是一种变长编码（常见 ASCII 字符 1 字节，典型常用汉字 3 字节，其他码点可能 1–4 字节）。不要把 Unicode “码点数量”与 UTF-8 “字节数量”混淆。
- `ord("A")==65`，`chr(65)=="A"`；凯撒密码字母平移需要取模 26。

```python
def digit_count(n):
    n = abs(n)
    if n == 0:
        return 1
    count = 0
    while n:
        n //= 10
        count += 1
    return count

def seven_digit_fourth_zero(n):
    return 1000000 <= n <= 9999999 and (n // 1000) % 10 == 0

def caesar(text, shift):
    result = []
    for ch in text:
        if 'a' <= ch <= 'z':
            result.append(chr((ord(ch)-97+shift)%26 + 97))
        elif 'A' <= ch <= 'Z':
            result.append(chr((ord(ch)-65+shift)%26 + 65))
        else:
            result.append(ch)
    return "".join(result)

assert digit_count(0)==1 and digit_count(123456789012345)==15
assert seven_digit_fourth_zero(1230456)
assert caesar("Abz!",3)=="Dec!"
assert caesar(caesar("Hello, World!",3),-3)=="Hello, World!"
```

### 4. 数组、字符串与排序：能答输入输出（【真题补全】）

| 真题变化 | 方法 | 易错点 |
|---|---|---|
| 后一个数大于前一个数的个数 | 扫 `i=1..n-1`，计 `a[i]>a[i-1]` | 不计等号 |
| 最大值/次大值，不许排序 | 保存 top1、top2 单次扫描 | 是否允许次大值等于最大值要看“distinct” |
| 无序数组的最大两数乘积 | `max1*max2` 与 `min1*min2` 取最大 | **有负数**时不能只选最大两个 |
| 字符频次列表 | `dict/Counter` | 平频时按 ASCII 升序（`ord` 或字符天然排序） |
| 日期按出生日期排序 | ISO `YYYY-MM-DD` 可字符串排序 | 必须合法且零补齐；源题示例有日期顺序/格式笔误 |
| 字符串中连续数字求和 | 将连续数字串累积为整数；遇非数字结算 | `"a12b3"` 是 15，不是 1+2+3 |
| 单峰数组 | 严格先升后降，峰值不能在两端 | 平台/重复值不算严格单峰 |
| 二维局部峰值 | 比较上下左右**有效**相邻元素 | 边界位置相邻数较少 |
| 令牌奖牌兑换 | 每级用 `//` 与 `%` 进位 | 不同批次汇率不同，**读准题干** |
| 0/1 居中三角形 | 外层控制行数/前导空格，内层交替输出 | 对齐宽度以题示为准 |

```python
from collections import Counter

def maximum_product_pair(a):
    if len(a) < 2:
        raise ValueError("need >= 2 elements")
    b = sorted(a)
    return max(b[0] * b[1], b[-1] * b[-2])

def char_frequencies(s):
    counts = Counter(s)
    return sorted(counts.items(), key=lambda kv: (-kv[1], ord(kv[0])))

def sum_number_groups(s):
    total, current, in_number = 0, 0, False
    for c in s + "#":
        if '0' <= c <= '9':
            current = current * 10 + int(c)
            in_number = True
        elif in_number:
            total += current
            current, in_number = 0, False
    return total

def is_strict_mountain(a):
    n = len(a)
    i = 0
    while i+1 < n and a[i] < a[i+1]:
        i += 1
    if i==0 or i==n-1:
        return False
    while i+1 < n and a[i] > a[i+1]:
        i += 1
    return i == n-1

assert maximum_product_pair([-10,-3,4,7])==30
assert char_frequencies("bbaaac")==[('a',3),('b',2),('c',1)]
assert sum_number_groups("q12w3e07")==22
assert is_strict_mountain([1,4,7,3,2])
```

**二维矩阵题**：若要求 Magic Square（幻方），检查每一行、每一列及两条主对角线的和是否相同；部分定义还要求元素恰为 `1..n²`，而 2020 原题只说“正整数且行列对角线等和”，**不能自行添加不重复的必要条件**。

```python
def is_magic_square(a):
    n=len(a)
    if n==0 or any(len(row)!=n for row in a):
        return False
    target=sum(a[0])
    return (all(sum(row)==target for row in a)
            and all(sum(a[i][j] for i in range(n))==target for j in range(n))
            and sum(a[i][i] for i in range(n))==target
            and sum(a[i][n-1-i] for i in range(n))==target)

def local_peaks(a):
    if not a or not a[0]:
        return []
    m,n=len(a),len(a[0])
    out=[]
    for i in range(m):
        for j in range(n):
            if all(a[i][j]>=a[i+di][j+dj]
                   for di,dj in [(1,0),(-1,0),(0,1),(0,-1)]
                   if 0<=i+di<m and 0<=j+dj<n):
                out.append((i,j))
    return out

assert is_magic_square([[2,7,6],[9,5,1],[4,3,8]])
assert (0,1) in local_peaks([[1,3],[2,1]])
```

**时间格式**：把时分转成总分钟 `t=60*h+m`，增减分钟或时差后 `t%=1440`，输出 `f"{h:02d}:{m:02d}"`。对于 12h → 24h：`12 AM→00`，`12 PM→12`；“澳洲→香港加 3 小时”属于**题目给定的简化条件**，现实跨城市时差会因城市/夏令时不同而改变。

### 5. C/C++ 与 Python 代码阅读（【真题补全】）

- Python 赋值 `a=b` 给变量绑定同一对象，`b=a[:]` 复制列表；可变对象与不可变对象行为不同。
- 函数中的普通局部变量不直接修改外部同名变量；若需要在 Python 函数内部重新绑定模块级名称，使用 `global`，但应避免无必要的全局状态。
- C 的普通函数参数**按值传递**，`swap(int a,int b)` 不能交换调用者变量；用 `int *` 传地址并解引用才可修改。
- C `&x` 取地址、`*p` 解引用；C++ 引用参数 `int&` 可直接改变实参。
- **`unsigned int`** 非负；典型 32 位环境范围 `0..2³²−1`，但标准不保证它永远 32 位。若使用固定宽度整数选 `uint32_t`。
- Python `//` 对负数是**向下取整**（如 `-7//3 == -3`）；C 整数除法通常向零截断（`-7/3 == -2`）。切勿跨语言直接套规律。
- C/C++ 自增表达式如 `i++` 与 `++i` 有不同返回值；涉及同一表达式对变量多次无序修改时，可能具有**未定义行为**，不要按某个编译器猜唯一答案。

**快速口述**：*“I first determine whether the argument is passed by value or by reference, then trace every mutation and print statement.”*

### 6. 令牌兑换、字符串倒三角与交替图形：三道完整代码（【25Fall/26Fall 真题】）

下面的代码刻意采用**可当场手写**的循环与下标写法，避免依赖复杂库。

```python
def token_rewards(tokens):
    # 10 tokens → green, 6 green → yellow,
    # 2 yellow → white, 2 white → medal
    green_total = tokens // 10
    yellow_total, green_left = divmod(green_total, 6)
    white_total, yellow_left = divmod(yellow_total, 2)
    medals, white_left = divmod(white_total, 2)
    need = 0 if medals else 240 - tokens
    return medals,white_left,yellow_left,green_left,need

def string_triangle(s):
    lines=[]
    while s:
        lines.append(s+s[::-1])
        s=s[1:-1] if len(s)>1 else ""
    return lines

def alternating_triangle(n):
    lines=[]
    for i in range(n):
        digits="".join(str((i+j)%2) for j in range(i+1))
        lines.append(digits.center(2*n-1))
    return lines

assert token_rewards(18)==(0,0,0,1,222)
assert token_rewards(220)==(0,1,1,4,20)
assert string_triangle("abc")==["abccba","b"+"b"]
assert len(alternating_triangle(3))==3
```

**注意**：“奖励兑换”题中多个材料版本对每一级兑换比例可能不同；以上是 25Fall 其中一张卷子的明示规则，不要把它写成所有年份通用的规则。字符串图形题若要求在每行保留原始长度或额外添加空格，严格以试卷的示例输出为准。

### 7. 特殊因子判定：与 n=a²+bᵖ 不是一回事（【往届】）

```python
def special_prime_factors(n):
    # 是否同时存在因子 p 和 p+2，且二者均为质数
    for p in range(2,n):
        if n%p==0 and n%(p+2)==0 and is_prime(p) and is_prime(p+2):
            return True
    return False

assert special_prime_factors(15)  # 因子 3 和 5
assert not special_prime_factors(14)
```
这里依赖本章已给出的 `is_prime()` 实现。若题目提供 `is_prime(m)` 函数，直接调用它即可，不需要重复写一遍质数判定代码。

### 8. 无排序求严格次大值（【往届原题】）

```python
def second_distinct_largest(a):
    first=second=None
    for x in a:
        if first is None or x>first:
            second,first=first,x
        elif x!=first and (second is None or x>second):
            second=x
    return second  # 不存在第二个不同值时返回 None

assert second_distinct_largest([4,9,9,5,7])==7
assert second_distinct_largest([3,3]) is None
```
遍历一次即可，时间 `O(n)`、空间 `O(1)`。如果考题把“第二大”定义为排序后的第二个元素（允许重复最大值），那么 `[9,9,7]` 的第二大就是 9；上述代码实现的是**第二个不同的最大值**，需要区分。

---

## V2｜进阶与迁移训练【拓展】

### E1. 埃拉托斯特尼筛与大量质数查询【拓展】

试除法求一个数是否是素数很有效，但如果题目一次查询很多个 `[1,N]` 之间的质数，应考虑筛法：
```python
def primes_up_to(n):
    if n < 2:
        return []
    prime=[True]*(n+1)
    prime[0]=prime[1]=False
    for p in range(2,int(n**0.5)+1):
        if prime[p]:
            for k in range(p*p,n+1,p):
                prime[k]=False
    return [x for x in range(2,n+1) if prime[x]]

assert primes_up_to(12)==[2,3,5,7,11]
```
时间约 `O(N log log N)`，空间 `O(N)`。何时选：要找**单个数**是否为素数选试除，要**批量输出范围内素数**选筛法。

### E2. 浮点数、Newton 平方根与精度【拓展】

牛顿法求 `√S`：`x_{next}=(x + S/x)/2`。每轮通常快速接近答案；`S=0` 直接返回 0，负数在实数域无解。浮点数比较尽量使用容差：
```python
def sqrt_newton(s, eps=1e-10):
    if s<0: raise ValueError("no real square root")
    if s==0: return 0.0
    x=max(1.0,float(s))
    for _ in range(1000):
        y=(x+s/x)/2
        if abs(y-x)<=eps*max(1.0,abs(y)):
            return y
        x=y
    return x
assert abs(sqrt_newton(20)**2-20)<1e-8
```
**迁移**：二分也能求平方根，若函数连续单调，比较 `mid²` 与 S 逐渐收缩区间。

### E3. 两种长度与字符编码陷阱【拓展】

Python `len(s)` 数的是 Unicode 字符串的码点个数（一般意义），而 `len(s.encode('utf-8'))` 是 UTF-8 字节长度。例如：
```python
assert len("HKU中")==4
assert len("HKU中".encode("utf-8"))==6
```
当题目说 “length of a string” 要区分**字符个数**还是**编码字节数**；在 C 中 `strlen` 返回以 `\0` 结尾的字节序列长度，并非 Unicode 字符数。

### E4. 复杂输入与鲁棒性【拓展】

白纸编程题容易忽视的边界：空输入、`n=0`、负数、重复、输入行末尾空白、日期跨年、`k` 不合法、复杂度。推荐按 **Input → Assumption → Algorithm → Complexity → Edge cases** 五步解释，不要只写代码。

### E5. 多种特殊数：先写“判定条件”再编程【拓展】

特殊数名常是出题人自定义的，考场不要把所有 “special / sacred / lunatic number” 当成同一种对象。若条件为 `n=a²+b³`，正整数 a、b，那么枚举 b 到 \(\lfloor\sqrt[3]{n-1}\rfloor\)，并检测余数是否为**完全平方数**。一个较好的实现是在 b 每次增长时使用整数比较 `b**3 < n`，而不是强制浮点三次根转整数（大整数有舍入风险）。

```python
from math import isqrt
def is_square_plus_cube(n):
    if n<=2:return False
    b=1
    while b**3<n:
        d=n-b**3
        a=isqrt(d)
        if a>=1 and a*a==d:
            return True
        b+=1
    return False
assert is_square_plus_cube(9) # 1²+2³
```

**变形**：如果问 `n=a²+b⁵`，仅把 b 的幂次改为 5；如果允许 `a=0` 或 b 为负，解集会改变。所谓“数学题会了但代码得分低”，常见原因就在**枚举范围/终止条件/正整数与非负整数**的差异上。

### E6. 位运算的实战：快速奇偶、XOR 与缺失数【拓展】

- `x & 1` 可判断整数最低位；对非负整数，结果为 1 则为奇数。
- `x ^ x = 0`、`x ^ 0 = x`，XOR 满足交换律/结合律。
- 适合查缺失数：把完整范围 XOR 一遍，再与数组中所有数字 XOR，成对出现者消掉，仅剩缺失值。
- 与求和法相比，XOR 不存在固定宽**加法溢出**风险，但仍要求输入满足“恰缺一个、其他元素恰一次”的约束。

```python
def missing_xor(nums,n):
    ans=0
    for i in range(n+1):
        ans ^= i
    for x in nums:
        ans ^= x
    return ans
assert missing_xor([0,2,3,4],4)==1
```

### E7. 一套“循环与状态机”解释模板【拓展】

考场上碰到令牌兑换、反复读数直到 `k<=0`、卡片向后加密等，别先猜最终数字，而应把程序写成**状态转换**：

1. **状态**：当前 token/green/yellow/white/medal 的数量，或正在读取的数字、字串和当前位置。
2. **转移**：每次循环或每次兑换会改变哪些变量。
3. **不变量**：转换前后的价值总额保持不变；例如一个 white = `2×6×10=120` tokens。
4. **终止条件**：输入到达非正整数、字符串遍历完、获得奖牌等。
5. **输出**：明确要的是兑换**剩余量**、已兑换总数还是**还差多少**。

题干若写“`20` token 对应 `1 white, 3 yellow, 22 green`”，却给出了 240 token 才能得一枚金牌的规则，先检查是否例子/排版错误，不要让示例反过来推翻明示的兑换定义。

### E8. 排序中的多重关键字与稳定性【拓展】

“先按频率从大到小，再按字符 ASCII 从小到大”是**两个排序键**：`(-frequency, ord(character))`。如果先按第二关键字排序，再用**稳定排序**按第一关键字排序，也能达到相同效果；但直接写两个 `sorted` 不明确稳定性时容易出错。

日期排序也属于复合比较：`(year,month,day)`。ISO 日期字符串 `YYYY-MM-DD` 的字典序与日期顺序一致，前提是年月日有固定宽度、补齐零且日期合法。若源数据出现 `2000-1-5` 这种非补零形式，就应解析成整数元组再排序。

### E9. 更靠近面试的代码解释训练【拓展】

**题：**输入 `[-4,3,-2,5]`，输出最大两数乘积。  
**思路**：第一候选是两个最大的正数相乘 `5×3=15`，第二候选是两个最小的负数相乘 `−4×−2=8`，最终 15；在 `[-10,-7,1,2]` 中则由最小两个负数给出 70。

**题：**用单次遍历找严格第二大**不同**元素。  
**思路**：保存最大 `first` 和次大 `second`，若 `x>first`，旧 first 下移到 second；若 `second<x<first`，更新 second；当出现重复最大值时不更新第二大。边界要处理“数组只有一个不同值”的情况（返回 `None` 或按题目规定报错）。

**题：**字符串出现中文或 emoji，比较 `len` 与 UTF-8 字节数。  
**思路**：用 `len(s)` 与 `len(s.encode('utf-8'))` 分别测；不要把“字符”和“字节”互相替换。实际 Java 字符串以 UTF-16 代码单元为基础，处理补充平面字符时 `String.length()` 可能与人眼所见字符数不同。

### E10. 从一个具体示例总结“正确性证明”【拓展】

以“0 到 n 中缺一个数”为例，完整序列总和为 `n(n+1)/2`。因为题目保证**只少一个、其他互异且都在 0..n 范围内**，实际数组和恰好比完整序列和少掉缺失值 m，因此两者相减必得 m。如果出现两个缺失数或重复输入，这个证明条件不再成立；代码依旧能返回某个数，但不一定有正确意义。

同样地，任何用贪心、二分、回溯的方法，都应能讲清楚“为什么不会遗漏合法答案”。这比单纯背诵复杂度更接近面试问法。
