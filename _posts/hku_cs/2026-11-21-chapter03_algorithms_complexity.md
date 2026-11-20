---
layout: post
title: "Chapter 03｜算法设计与复杂度：选择题 + 手写代码核心章"
tags: [HKU MSc CS, 编程]
permalink: /hku_cs/chapter03_algorithms_complexity.html
---
> **目标**：会算复杂度、识别排序/查找套路、现场写出常见数组/字符串/图算法，并能口头解释。  
> **优先级：A+**｜建议 90–120 分钟；读完后至少手写 4 道代码。  
> **近期对应题型**：`O(n²log n)` 循环、归并/快排、插入排序、贪心找零、最长至多两种字符子串、三数之和、全排列、课程表。

> **V2 版本说明**：以你上传的真题/笔经为核心，补充对应题型、完整解法与适当进阶。标注 **【真题补全】** 为资料直接涉及的考点；标注 **【拓展】** 为额外提高题；个别原资料答案如有问题会说明。

## 1. 时间复杂度：最常见的送分/失分点

大 O 只关注输入规模增加时的主要增长量：忽略常数和低次项。

| 代码模式 | 时间复杂度 | 原因 |
|---|---|---|
| 一次完整扫描 | `O(n)` | 每项一次 |
| 双层各遍历 `n` | `O(n²)` | `n×n` |
| `for j in range(i,n)` | `O(n²)` | 总次数 `n+(n-1)+...+1` |
| `while k<n: k*=2` | `O(log n)` | 倍增 |
| 排序再遍历 | `O(n log n)` | 通常排序主导 |
| 递归 `T(n)=T(n-1)+O(1)` | `O(n)` | 深度 n |
| 两个递归分支（朴素 Fibonacci） | 指数级，常给上界 `O(2^n)` | 重复子问题 |
| 邻接表 DFS/BFS | `O(V+E)` | 顶点和边各检查常数次 |

**笔经型例题**：
```python
n = 10  # 示例输入规模；复杂度分析仍将 n 视为变量
for i in range(n):
    for j in range(i, n):
        k = 1
        while k < n:
            k *= 2
```
前两层累计 `n(n+1)/2 = Θ(n²)`，内层倍增 `Θ(log n)`，总 **`Θ(n² log n)`**。

**空间复杂度**：额外数组长度 n → `O(n)`；递归调用深度 n → `O(n)` 调用栈；只使用固定数量变量 → `O(1)`。如果结果本身必须存下 n! 个排列，输出存储不可能是常数空间。

## 2. 查找与排序的比较

| 算法 | 平均时间 | 最坏时间 | 稳定？ | 记忆重点 |
|---|---|---|---|---|
| 冒泡排序 | `O(n²)` | `O(n²)` | 是（常规实现） | 相邻交换 |
| 插入排序 | `O(n²)` | `O(n²)` | 是（常规实现） | 基本有序时快 |
| 选择排序 | `O(n²)` | `O(n²)` | 通常否 | 每轮选最小 |
| 希尔排序 | 依增量而定 | 依增量而定 | 通常否 | 分组插入 |
| 归并排序 Merge | `O(nlogn)` | `O(nlogn)` | 是（常规实现） | 分治 + 合并，额外空间一般 `O(n)` |
| 快速排序 Quick | `O(nlogn)` | `O(n²)` | 通常否 | 分区；枢轴很不平衡时退化 |
| 堆排序 Heap | `O(nlogn)` | `O(nlogn)` | 否 | 堆顶反复取极值 |

**排序稳定性**：若两个元素键相等，排序后仍保持原来的前后顺序，则稳定。注意题目问的是**一般算法实现**还是某个具体变种。

### 二分查找（A）

前提：**有序数组**；每次取中间位置，根据比较结果排除一半。

```python
def binary_search(a, target):
    lo, hi = 0, len(a)-1
    while lo <= hi:
        mid = (lo+hi)//2
        if a[mid] == target:
            return mid
        if a[mid] < target:
            lo = mid+1
        else:
            hi = mid-1
    return -1
```

复杂度 `O(log n)`，额外空间 `O(1)`。若找第一个/最后一个目标位置，则相等时不立刻返回，转而缩小一侧区间。

**二维按行、按列递增矩阵的查找**：从**右上角**出发；当前值太大向左，太小向下，尺寸 `m×n` 最多 `O(m+n)` 次比较。若矩阵每行末尾严格小于下一行开头，可视为一维有序表二分；不要混淆两种条件。

## 3. 双指针、滑动窗口与区间题（A）

### 三数之和最接近目标值

排序 `O(nlogn)`；固定第一个数，剩下用左右指针，整体 `O(n²)`，满足“快于 `O(n³)`”的要求。

```python
def three_sum_closest(nums, target):
    nums.sort()
    best = nums[0] + nums[1] + nums[2]
    for i in range(len(nums)-2):
        l, r = i+1, len(nums)-1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if abs(s-target) < abs(best-target):
                best = s
            if s < target:
                l += 1
            elif s > target:
                r -= 1
            else:
                return target
    return best
```

**注意**：若出现一样接近的和，题干如果规定如何决胜，需要在 `best` 更新条件里补充规则。输入通常需至少 3 个数。

### 最长只含至多两个不同字符的子串（A）

从左向右扩展右端；如果窗口有超过两类字符，就移动左端直到重新合法。

```python
def longest_two_distinct(s):
    left, count, best = 0, {}, 0
    for right, c in enumerate(s):
        count[c] = count.get(c, 0) + 1
        while len(count) > 2:
            d = s[left]
            count[d] -= 1
            if count[d] == 0:
                del count[d]
            left += 1
        best = max(best, right-left+1)
    return best

assert longest_two_distinct("eceba") == 3
```

每个字符至多进出窗口一次，所以时间 `O(n)`，记录的不同字符通常很少。**“恰好两个”与“至多两个”不同**，如果题目要求恰好两类字符，还需检查合法窗口的类别数。

### 区间合并（B）

按起点排序，依次比较本段起点与上一段终点：
- 起点 `<=` 上一个终点：通常视作相交，可合并（端点开闭以题目为准）；
- 否则新开一个区间。

时间 `O(nlog n)`（排序）；输出空间 `O(n)`。

## 4. 递归、回溯、排列与字典序（A）

**递归四件事**：参数含义 → 终止条件 → 递归子问题 → 返回值/撤销选择。对于 `n` 个互不相同的元素，**全排列有 `n!` 个**，输出所有结果至少需要与总输出规模成正比的时间。

```python
def permute(nums):
    ans = []
    def dfs(start):
        if start == len(nums):
            ans.append(nums[:])     # 必须复制，不能直接附加同一个列表对象
            return
        for i in range(start, len(nums)):
            nums[start], nums[i] = nums[i], nums[start]
            dfs(start+1)
            nums[start], nums[i] = nums[i], nums[start]  # 恢复现场
    dfs(0)
    return ans
```

复杂度：生成并复制所有排列约 **`O(n·n!)`**，额外递归深度 `O(n)`（不计输出）。若有重复元素，需要去重或剪枝。

**下一个字典序排列（Next Permutation）**：
1. 从右向左找第一个 `a[i] < a[i+1]` 的位置；
2. 再从右向左找第一个大于 `a[i]` 的元素与它交换；
3. 反转后缀。无此 `i` 表示当前是最大排列，常规实现反转成最小排列。
例如 `[1,3,2] → [2,1,3]`。复杂度 `O(n)`。

**整数拆成 1 和 3 等题**：选一个数，递归处理剩余 `n-choice`；用 `n==0` 代表找到一个合法解，`n<0` 排除；题目是否允许顺序不同算不同，要明确。

## 5. 图搜索与课程表（A/B）

- **DFS** 适合找连通/可达、枚举路径、找环；**BFS** 适合求无权最短步数。
- 邻接表下 DFS/BFS 时间 `O(V+E)`。
- **拓扑排序**：先修课形成有向图，若能处理全部课程则无有向环。

约定 `prerequisites` 的元素 `[course, pre]` 意味着 `pre → course`：

```python
from collections import deque

def can_finish(num_courses, prerequisites):
    graph = [[] for _ in range(num_courses)]
    indeg = [0] * num_courses
    for course, pre in prerequisites:
        graph[pre].append(course)
        indeg[course] += 1
    q = deque(i for i in range(num_courses) if indeg[i] == 0)
    done = 0
    while q:
        u = q.popleft()
        done += 1
        for v in graph[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)
    return done == num_courses
```

**为什么能判断环**：无前驱节点可以最先完成；若最后还有节点无法取出，说明仍存在循环依赖。时间 `O(V+E)`，空间 `O(V+E)`。

## 6. 贪心与动态规划（A/B）

### 贪心（Greedy）

每一步选当前看来最好的方案。**并非永远得到全局最优解**。

**硬币反例**：币值 `{1,3,4}`，凑 `6`。贪心先拿 `4+1+1` 需 3 枚，最优是 `3+3` 只需 2 枚。笔试喜欢问“哪种币值不能保证贪心最优”。

### 动态规划（Dynamic Programming, DP）

核心是**重复子问题**与**最优子结构**。做题可用四步说明：
1. 状态表示什么；
2. 状态如何从较小问题转移；
3. 初始状态；
4. 计算次序和复杂度。

**斐波那契**：朴素递归指数级，迭代/记忆化能做到 `O(n)` 时间。只保存前两项还能做到 `O(1)` 额外空间。

**最少硬币数**（不限每种硬币使用次数）：
```python
def min_coins(coins, amount):
    INF = amount + 1
    dp = [INF] * (amount + 1)
    dp[0] = 0
    for s in range(1, amount + 1):
        for c in coins:
            if s >= c:
                dp[s] = min(dp[s], dp[s-c]+1)
    return dp[amount] if dp[amount] != INF else -1
```
时间 `O(amount × 硬币种类数)`，空间 `O(amount)`。

**鸡蛋掉落**：状态通常涉及“蛋数、允许次数/楼层”，用决策拆分最坏情况，面试重点是**解释为何取最大损失再求最小**；不必优先记忆所有优化算法。

**最多两次股票买卖**：一次交易中追踪“到当天为止最低买价”和最高收益；两次交易可做从左到右单次交易利润、从右到左单次交易利润，再组合，`O(n)` 时间。必须满足“先卖后买，交易不重叠”。

**任务调度与负载均衡**：先识别目标是最小化**最大完工时间（makespan）**还是最小化总流经时间；两者不是同一优化问题。不能只凭“总时间最小”就套一个贪心公式。

## 7. 面试口头解释模板

- **复杂度**：*“The two nested loops take quadratic time, and the doubling loop contributes an additional log n factor.”*
- **归并排序**：*“Merge sort divides the array, sorts each half recursively, and merges them in linear time. Its worst-case complexity is O(n log n).”*
- **快排**：*“Quick sort partitions around a pivot; its average complexity is O(n log n), but the worst case is O(n squared).”*
- **滑动窗口**：*“Each pointer only moves forward, so every character is processed a constant number of times.”*
- **课程表**：*“I build a directed graph and use topological sorting. If I cannot process all vertices, a directed cycle remains.”*

## 8. 迷你自测

1. 外层 `n`、内层从 `i` 到 `n`、再乘 2 的循环：**`Θ(n² log n)`**。  
2. 归并与快排哪个具有稳定的最坏 `O(nlogn)`？**归并排序**。  
3. `{1,3,4}` 凑 `6`，贪心与最优分别几枚？**3、2**。  
4. 字符串 `eceba`，最长至多两类字符的子串长度？**3**（`ece`）。  
5. 图有课程依赖 `0→1, 1→2, 2→0`，可否全部修完？**不能，有向环**。  
6. `n=5` 的无重复元素有多少个全排列？**120**。

**掌握标准**：能手写二分、双指针、滑动窗口、回溯全排列、课程表；能口述常见排序与复杂度。若时间紧，优先完成这五项，再看高级 DP/博弈。

---

## V2｜原始资料真题补全

### 1. 两种“递增子序列”不能混淆（【26Fall 7.6 北京 + 往届高频】）

- **最长连续递增子数组/子串（LCIS）**：相邻元素必须连续；扫描 `a[i]>a[i-1]` 时递增长度，否则重置为 1。`O(n)`。
- **最长递增子序列（LIS）**：可以跳过中间元素；`[10,9,2,5,3,7,101,18]` 的 LIS 长度是 4（如 `[2,3,7,18]`）。朴素 DP `dp[i]=1+max(dp[j])`（`j<i` 且 `a[j]<a[i]`）时间 `O(n²)`。
- 26Fall 要求优于 `O(n²)`：`tails[k]` 保存“长度为 k+1 的递增子序列**可能达到的最小末尾值**”，用二分 `bisect_left` 更新，时间 `O(nlogn)`。`tails` 不一定是输入中的一个真实 LIS，不应误当作原序列。

```python
from bisect import bisect_left
def lis_length(nums):
    tails=[]
    for x in nums:
        i=bisect_left(tails,x)  # 严格递增；非严格时改 bisect_right
        if i==len(tails): tails.append(x)
        else: tails[i]=x
    return len(tails)

def longest_contiguous_increase(nums):
    if not nums: return 0
    best=cur=1
    for i in range(1,len(nums)):
        cur=cur+1 if nums[i]>nums[i-1] else 1
        best=max(best,cur)
    return best

assert lis_length([10,9,2,5,3,7,101,18])==4
assert longest_contiguous_increase([1,3,5,4,7])==3
```

### 2. 最大连续子数组和（Kadane）（【25Fall 4.12 北京】）

`dp[i]` 表示**必须以第 i 项结尾**的最大连续子数组和：
\[
dp[i]=\max(a[i], dp[i-1]+a[i]).
\]
答案取所有位置 `dp[i]` 的最大值。时间 `O(n)`、空间 `O(1)`，千万不要为了“负数也能输出 0”而把初始化直接设 0；若题目要求**非空**子数组，`[-5,-2]` 的结果是 `-2`。
```python
def max_subarray(a):
    if not a: raise ValueError("nonempty array required")
    cur=best=a[0]
    for x in a[1:]:
        cur=max(x,cur+x)
        best=max(best,cur)
    return best

assert max_subarray([-2,1,-3,4,-1,2,1,-5,4])==6
assert max_subarray([-5,-2,-9])==-2
```

### 3. 幂集 Power Set、位串与子集和（【2020 正式卷/25Fall 线上】）

- **n 位 0/1 位串**：共有 `2ⁿ` 种，每位可选 0 或 1，可用递归参数 `prefix` 逐位追加。
- **幂集**：n 个元素的所有子集也有 `2ⁿ` 个，包括 `∅` 和全集；可以为每个元素定义“不选/选”二选一。
- 2020 题要求实际程序而非伪代码，25Fall Q1 同样要求生成集合的幂集。输出全部结果至少有 `Θ(n2ⁿ)` 的元素拷贝/输出规模。
- **Subset Sum**：给一组正整数与目标 T，判断是否有若干项和为 T。小规模用回溯；T 不大时可以用 `dp[s]` 表示是否凑得出，0/1 型背包的 `s` 应**从大到小遍历**，防止同一元素被重复使用。

```python
def bitstrings(n):
    ans=[]
    def dfs(prefix):
        if len(prefix)==n:
            ans.append(prefix); return
        dfs(prefix+"0")
        dfs(prefix+"1")
    dfs("")
    return ans

def powerset(a):
    out=[[]]
    for x in a:
        out += [subset+[x] for subset in out]
    return out

def subset_sum(a,target):
    if target<0: return False
    possible=[False]*(target+1)
    possible[0]=True
    for x in a:
        if x<0: raise ValueError("nonnegative inputs expected")
        for s in range(target,x-1,-1):
            possible[s] |= possible[s-x]
    return possible[target]

assert len(bitstrings(3))==8
assert len(powerset([1,2,3]))==8
assert subset_sum([2,5,7],9) and not subset_sum([2,5,7],1)
```

### 4. N 皇后与组合枚举（【往届笔经】）

N Queens：n×n 棋盘放 n 个皇后，任意两个不能同一行/列/对角线。每行恰放一个，逐行尝试列 `c`，保持集合：
- 已用列 `cols`；
- 主对角线 `r-c`；
- 副对角线 `r+c`。
若任一冲突则跳过，成功后递归下一行，返回前撤销集合。时间最坏指数/阶乘级，只要求能写回溯框架而非精通位运算优化。

```python
def n_queens_count(n):
    cols,diag1,diag2=set(),set(),set()
    def dfs(r):
        if r==n: return 1
        total=0
        for c in range(n):
            if c in cols or r-c in diag1 or r+c in diag2:
                continue
            cols.add(c);diag1.add(r-c);diag2.add(r+c)
            total+=dfs(r+1)
            cols.remove(c);diag1.remove(r-c);diag2.remove(r+c)
        return total
    return dfs(0)
assert n_queens_count(4)==2
```

**从全排列迁移**：对于 `n` 人排队、n 个不同元素的排列，排列对象互异→ `n!`；对重复元素需去重；若只选 k 人且顺序不重要，则用组合 `C(n,k)`。

### 5. 子串与窗口：两个不同问题（【笔经原题/26Fall】）

- **最长公共子串（Longest Common Substring）**：两个字符串中**连续**出现的最长相同片段，DP `dp[i][j]` 若 `a[i-1]==b[j-1]` 则 `dp[i][j]=dp[i-1][j-1]+1`，否则为 0。长度 `m,n`，时间 `O(mn)`。
- **最长含至多 k 种不同字符的子串**：将当前 Chapter 03 的“两种”窗口推广为 `while len(count)>k` 即可；`k=0` 返回 0。这里“连续”意味着左右指针间每个字符都属于所求子串。
- **Longest Common Subsequence（最长公共子序列）** 不要求连续，转移不同，不能混淆。

```python
def longest_common_substring(a,b):
    prev=[0]*(len(b)+1)
    best=0
    for c1 in a:
        cur=[0]*(len(b)+1)
        for j,c2 in enumerate(b,1):
            if c1==c2:
                cur[j]=prev[j-1]+1
                best=max(best,cur[j])
        prev=cur
    return best

def longest_at_most_k(s,k):
    if k<=0: return 0
    counts={}; left=best=0
    for right,c in enumerate(s):
        counts[c]=counts.get(c,0)+1
        while len(counts)>k:
            d=s[left]; counts[d]-=1
            if counts[d]==0: del counts[d]
            left+=1
        best=max(best,right-left+1)
    return best
assert longest_common_substring("abcXYZ","oXYZp")==3
assert longest_at_most_k("eceba",2)==3
```

### 6. 二分法、二维矩阵搜索与局部峰值（【25Fall 11.16/26Fall 7.20】）

**二分插入位置**：维护半开区间 `[lo,hi)`，用 `lo<hi`，条件 `a[mid]<target` 时 `lo=mid+1`，否则 `hi=mid`；返回**第一个大于等于目标的位置**，也就是若不存在的插入下标。

```python
def lower_bound(a,target):
    lo,hi=0,len(a)
    while lo<hi:
        m=(lo+hi)//2
        if a[m]<target: lo=m+1
        else: hi=m
    return lo
assert lower_bound([1,3,5,6],2)==1
assert lower_bound([1,3,5,6],5)==2
```

**行/列分别升序的 15×10 卡片矩阵**：从**右上角**比较，太大向左，太小向下；最多走 `m+n−1=24` 个位置（最坏情形），找不到也能正确报告不存在。它不要求下一行的第一个大于上一行的最后一个，不能把它强行拉平进行全局二分。

**二维 Peak（局部极大值）**：只要不小于上下左右**存在**的邻居即可；不需要是全局最大值。逐点扫描 `O(mn)` 可列出所有局部峰值；若题目只要求找**一个**局部峰值，可考虑按列分治，取中间列的列最大元素，再根据左右邻居决定是否向某半边搜索；经典算法可做到 `O(m log n)`。

### 7. 多处理器任务调度、TSP 与优化目标（【25Fall】）

**处理器任务调度（Makespan）**：有 p 个处理器，每个任务运行时间 `t_j`，同一处理器不能并行，目标是**最小化各处理器负载最大值**。目标函数
\[
\min_{\text{assign}}\max_{1\le i\le p}\sum_{j\text{ assigned to }i}t_j.
\]
- 任务少：回溯枚举分配，剪枝并检查最优性。
- 任务多：LPT 启发式（任务按耗时从大到小排列，再分给当前负载最小的处理器），很快，但**不保证所有实例上精确最优**。
- 下界：最优最大负载至少 `max(max(tasks), sum(tasks)/p)`。

**TSP / 遍历所有点的最短路线**：访问全部节点的最短路径与一般无权 BFS 求“从 s 到 t 的最少边数”不同。小 n 枚举所有排列、对总路长求最小；如需返回起点形成**回路**，还要加最后一段返回边。TSP 一般是 NP-hard；小 n 可做位压缩 DP `O(n²2ⁿ)`，大 n 常用近似/启发式。

**在时间预算内完成最多次交流**：若每项交流只占一段独立耗时、没有开始/结束时刻和相互约束，则按耗时**升序**取能装下的最多项；若每项有固定的开始/结束时间，则是**活动选择**，按结束时间选兼容活动。两者不能套同一种规则。

### 8. 两枚鸡蛋与 100 层楼：完整最坏情况策略（【25Fall 真题】）

有两枚相同鸡蛋，存在一个临界层：高于临界层会碎、低于或等于不会碎；目标是在最坏情形下最少投掷次数确定临界层。

假设给最多 `d` 次机会。第一次投第 `d` 层，没碎则上升 `d-1` 层，再上升 `d-2`，……。如果第一枚在某层碎，第二枚用于逐层扫描此前跳过的区间，保证最坏次数不超过 d。

因此最多能覆盖 `d+(d-1)+...+1=d(d+1)/2` 层。需要
\[
d(d+1)/2\ge100.
\]
`13×14/2=91<100`，`14×15/2=105≥100`，故**14 次**。投掷层数可为 14、27、39、50、60、69、77、84、90、95、99、100（到顶截断），而不是固定步长。

**为何不是二分？** 两枚鸡蛋碎掉后无法继续，二分的两条分支成本并不对称。

### 9. 数字拼接最大值、令牌兑换、股票两笔交易（【真题/笔经】）

**拼接最大值**：给 `[9,34,30,5]`，排序比较字符串 `a+b` 与 `b+a`，如果 `a+b>b+a` 则把 a 放前面，最终得到 `953430`。**不可直接按数值大小或字符串字典序排序**。
```python
from functools import cmp_to_key
def largest_concat(nums):
    words=list(map(str,nums))
    def cmp(a,b):
        return -1 if a+b>b+a else (1 if a+b<b+a else 0)
    s="".join(sorted(words,key=cmp_to_key(cmp)))
    return "0" if s and s[0]=="0" else s
assert largest_concat([9,34,30,5])=="953430"
```

**令牌→卡片→奖牌**：单位兑换与时间换算一样，逐层 `//` 获取可兑换件数，再 `%` 获取余量。25Fall 原题的一种配置：10 token→1 green；6 green→1 yellow；2 yellow→1 white；2 white→1 medal，所以**一枚奖牌需 240 tokens**，若已有 18 个 token，还差 222。注意同一笔经另一批次写过 4 green→yellow，不能混用。

**最多两次股票交易**：对每个日子算“此前最多做一次的利润”与“此后最多做一次的利润”，枚举分割点合并，`O(n)` 时间。`[3,3,5,0,0,3,1,4]` 答案 **6**（0→3、1→4），不能允许同时持仓两笔交易。

### 10. 递推/DP 变体：跳台阶与矩阵方法（【2020–26Fall】）

- 每次跳 1 或 2：`f(n)=f(n-1)+f(n-2)`、`f(0)=1,f(1)=1`，求方案数 `O(n)`。
- 每次可跳 1、2、3：**若没有其他约束**，`f(n)=f(n-1)+f(n-2)+f(n-3)`，`f(0)=1`、`f(n<0)=0`。
- 25Fall 某题另有限制“不能连续三次跳 1 级”，则**不能直接使用不带记忆状态的三项相加**。可定义 `dp[remaining][streak]`，`streak∈{0,1,2}` 表示刚连续跳了几次 1 级，加入跳 2/3 后 streak 清零。
- 想求所有方法的**具体路径**，用回溯；只求**方案数**，用 DP/递推，复杂度较小。

### 11. 并区间、下一个排列、汉诺塔：完整代码（【2020/25Fall/原始面经】）

**Merge Intervals**：将区间按起点排序，逐个合并。假设区间是闭区间 `[start,end]`，接触端点也算相交；若题目规定开区间，需要修改条件。
```python
def merge_intervals(intervals):
    out=[]
    for l,r in sorted(intervals):
        if not out or l>out[-1][1]:
            out.append([l,r])
        else:
            out[-1][1]=max(out[-1][1],r)
    return out
assert merge_intervals([[1,3],[2,6],[8,10],[15,18]]) == [[1,6],[8,10],[15,18]]
```

**Next Permutation**：从右向左找下降序列前的枢轴，把枢轴与后缀里比它大的最右元素交换，再反转后缀。
```python
def next_permutation(a):
    i=len(a)-2
    while i>=0 and a[i]>=a[i+1]:
        i-=1
    if i<0:
        return False  # 无下一个排列；原数组不变
    j=len(a)-1
    while a[j]<=a[i]:
        j-=1
    a[i],a[j]=a[j],a[i]
    a[i+1:]=reversed(a[i+1:])
    return True

a=[1,3,2]
assert next_permutation(a) and a==[2,1,3]
```
有些语言库在到达最后一个排列时，会**重置为最小排列**；25Fall 回忆算法则可能返回 0 且数组不变。需根据题干对“无下一个排列”时的行为规定作答。

**Tower of Hanoi（汉诺塔）**：把 n 个圆盘从 src 移到 dst，aux 为辅助柱，不能把大盘压在小盘之上。递归移动 n−1 个 → 移最大盘 → 递归移动 n−1 个：
```python
def hanoi(n,src="A",dst="C",aux="B"):
    if n==0:
        return []
    return (hanoi(n-1,src,aux,dst)
            +[(src,dst)]
            +hanoi(n-1,aux,dst,src))
assert len(hanoi(4))==2**4-1
```
递推 `T(n)=2T(n−1)+1`，最少移动次数 \(2^n−1\)。由于返回全部操作，输出大小就是指数级；不能在需要列出所有步骤时声称 `O(n)` 总时间。

### 12. 整数拆分与跳台阶：手写递归（【往届反复真题】）

**把正整数 N 拆成若干个 1 或 3，顺序不同算不同方案**：用递归参数“剩余量”和“目前路径”，为每个允许的步长单独递归。`N=4` 应输出 `1111`、`13`、`31`，共 3 种。

```python
def ordered_splits(n,choices=(1,3)):
    ans=[]
    def dfs(left,path):
        if left==0:
            ans.append(path[:]); return
        for step in choices:
            if step<=left:
                path.append(step)
                dfs(left-step,path)
                path.pop()
    dfs(n,[])
    return ans

def ways_to_climb(n,steps=(1,2)):
    dp=[0]*(n+1)
    dp[0]=1
    for total in range(1,n+1):
        dp[total]=sum(dp[total-step] for step in steps if total>=step)
    return dp[n]

assert len(ordered_splits(4))==3
assert ways_to_climb(4)==5
```

若题目要求**列出所有**序列，回溯输出规模可能指数级；若仅求**总方案数**，DP 通常 `O(n·步长种类数)` 即可。两题语言看似相近，但输出要求和复杂度完全不同。

---

## V2｜进阶与迁移训练【拓展】

### E1. 股票最多两笔交易：常数空间状态机【拓展】

比原资料的前后缀数组更精简，维护四个状态：第一次买入/卖出、第二次买入/卖出：
```python
def max_two_trades(prices):
    buy1=buy2=float("-inf")
    sell1=sell2=0
    for p in prices:
        buy1=max(buy1,-p)
        sell1=max(sell1,buy1+p)
        buy2=max(buy2,sell1-p)
        sell2=max(sell2,buy2+p)
    return sell2
assert max_two_trades([3,3,5,0,0,3,1,4])==6
```
时间 `O(n)`、额外空间 `O(1)`。初次看不懂时优先掌握真题方法，再看优化版本。

### E2. 位压缩 DP 和小规模 TSP【拓展】

当图只有 10–15 个节点，可用 `dp[mask][v]` 表示已访问节点集合为 `mask`，最后停在 v 的最短总路径长度：
\[
dp[mask\cup\{u\}][u]
=\min(dp[mask][v]+w(v,u)).
\]
初始 `dp[1<<start][start]=0`，最终取所有 `dp[(1<<n)-1][v]` 的最小值；如果必须回到出发点，再加 `w(v,start)`。复杂度 `O(n²2ⁿ)`，比枚举全排列 `O(n·n!)` 适合稍大的 n。一般面试只需解释状态即可。

### E3. 最大独立集与 Clique 的转换【拓展】

集合 S 是独立集当且仅当任意两点无边；在原图 G 中找独立集相当于在**补图** \(\bar G\) 中找完全子图 Clique。由此可把 Ramsey 问题统一为“在原图或补图中找 k 阶 Clique”。**连通分量不是独立集**，DSU 无法直接替代。

### E4. 贪心正确性：交换论证【拓展】

“先选最快任务、使预算内完成最多个数”可以用交换论证：若一个最优选择包含耗时较长的任务却漏掉较短的任务，替换后数量不减、耗时不增，因而存在最优解优先选短任务。对一般任务调度的 Makespan，无法直接给出这种交换论证，所以 LPT 通常是启发式而非总能最优。

### E5. 动态规划性能比较【拓展】

- `n` 阶台阶计数 `O(n)`，可用滚动数组降至 `O(1)` 额外空间。
- 含 k 次交易的股票 DP 常用 `O(kn)` 时间。
- 最小硬币数 `O(amount×币种数)` 伪多项式；若 `amount` 很大，即使输入位数很短也可能很慢。
- 状态很多时，**先看约束和输入规模**，再决定 `O(n²)`、`O(nlogn)` 或指数回溯是否可行。

### E6. LIS 要求输出具体子序列，而不只是长度【拓展】

`tails` 只保存每种长度下“可能的最小末尾值”，它不等于真实的 LIS。若要恢复 LIS，可以另外记录：
- `tail_idx[len]`：对应长度的末尾元素在原数组中的索引；
- `parent[i]`：当前元素承接的上一个元素索引；
- 每次新建/更新一个 tail 时记录 `parent`；
- 从最长链尾向前追踪，再反转得到一个有效答案。

这部分需要额外 `O(n)` 空间，时间仍 `O(nlogn)`。在选择题中若问“`tails` 本身就是最终 LIS”，一般应判**错**。

### E7. 前缀和与哈希：连续子数组和等于 K【拓展】

定义前缀和 `S[0]=0`，`S[i+1]=a[0]+...+a[i]`。区间 `[l,r)` 的和就是 `S[r]-S[l]`；寻找“和为 k 的连续子数组”意味着寻找两个前缀和差为 k。

```python
def count_subarrays_sum_k(a,k):
    seen={0:1}; pref=0; ans=0
    for x in a:
        pref+=x
        ans+=seen.get(pref-k,0)
        seen[pref]=seen.get(pref,0)+1
    return ans
assert count_subarrays_sum_k([1,1,1],2)==2
```
平均 `O(n)` 时间、`O(n)` 空间；包含负数时，不能直接使用只会前进的普通“双指针求固定和”方法。

### E8. 0/1 背包与无限硬币：循环方向是关键【拓展】

- **每个物品最多一次**：从大到小遍历目标容量/金额，防止当前物品被同一轮反复使用；
- **每种硬币可无限使用**：常见一维 DP 从小到大遍历，允许使用刚更新过的状态；
- **求最少硬币数**和**求方案数**的状态转移不同，一个用 `min`，另一个用 `+`。
遇到 `amount=6, coins={1,3,4}`，无穷硬币最少个数是 2；若每种硬币只允许一次，可能需要不同解法。

### E9. 最大元音子串贡献的线性计数【拓展】

题目可能问：统计**所有子串**中元音字母总共出现的次数（例如元音是 a/e/i/o/u）。对于长度 n 的字符串，位置 i 的字符出现在多少个子串中？其左端有 `i+1` 种选择，右端有 `n-i` 种选择，贡献为 `(i+1)(n-i)`。对所有元音位置求和即可，时间 `O(n)`，不必真的枚举 `O(n²)` 个子串。

```python
def total_vowel_contribution(s):
    n=len(s)
    return sum((i+1)*(n-i) for i,c in enumerate(s.lower())
               if c in "aeiou")
assert total_vowel_contribution("aba")==6  # 两个 a 各出现 3 次
```

### E10. 区间调度的结束时间贪心证明【拓展】

有多个固定时间区间 `[start,end)`，要选择**最多互不重叠**活动：按**结束时间从早到晚**排序，每次选起点不早于上一个已选终点的活动。这与“每项只是耗时、随时可以开始”的按耗时排序不同。证明思路：若最优解第一项不是结束最早的活动，将其替换成结束更早的活动，不会使后续安排更难，故存在以最早结束活动开始的最优解。

### E11. 二维峰值与局部最优的区别【拓展】

二维 Peak 只要求与**相邻**位置比较，在某个位置值为 7、周围 6/5/3/4 时是局部峰值，哪怕远处还有 100。对“返回任意一个峰值”，通过每次选择中间列最大值并向更大的水平邻居所在一侧搜索，可降低比较列数；对“返回所有峰值”，最坏仍需扫描整张矩阵的点。

### E12. 最大独立集的回溯解题框架【拓展】

要找无向图中的**最大**独立集（不只是判断给定 k 人互不认识），小规模可递归处理一个顶点 v 的两种选择：
1. **不选 v**：在剩余顶点中继续求解；
2. **选 v**：所有 v 的邻居都不能选，于是递归处理删除 v 和其邻居后的图，结果数量加 1；
取两者较大。最坏指数时间，这是一个 NP-hard 问题，普通并查集不适用。

### E13. 识别“可能需要 DP”而非直接贪心【拓展】

当题目有“最少成本、最多利润、所有可能方案、资源限制”并且选当前最优未必保证整体最优时，考虑 DP。先写一个小规模反例测试贪心，再决定是否转 DP。像找零 `{1,3,4}` 目标 6，就是最快的贪心反例：最优 `3+3`，贪心 `4+1+1`。

### E14. “恰好”和“至多”的 DP 语义区别【拓展】

股票“最多两次交易”可以选择只交易一次或零次；如果题目改成“**必须完成恰好两次交易**”，零交易默认收益 0 的初始化会不再等价。类似地，滑动窗口“至多两种不同字符”在只有一种字符的情况下也满足条件；“恰好两种”需要额外检查窗口内确实有 2 种字符。先在草稿上圈出 `at most / exactly / at least`，能避免算法正确但目标理解错误。

### E15. 面试时如何用反例否定错误算法【拓展】

要求“快速排序最快吗？”时可以回答：快排平均 `O(nlogn)`，内存和常数开销常有优势，但最坏 `O(n²)`；归并稳定且最坏 `O(nlogn)`；插入排序在小规模或几乎有序数据上可能更实用。任何“算法 X 在任何场景绝对最快”的论断都应先问输入分布、内存限制、是否要求稳定以及比较模型。

### E16. 搜索算法的正确性不变量【拓展】

二分查找用半开区间 `[lo,hi)`：**所有可能符合答案的下标始终保留在该区间内**。每轮比较 `a[mid]` 之后只排除逻辑上不可能的半区，区间严格缩短直至 `lo==hi`。口头证明复杂度时说明“每次至少排除约一半候选区间”，因此迭代次数 `O(logn)`；这比只说“用了二分所以 logn”更严谨。

### E17. 如何处理输入不满足先验条件【拓展】

二分查找需要有序数组，滑动窗口中的“两个指针只前进”通常要求窗口合法性随左右移动满足特定单调性质，Dijkstra 一般要求非负边权，朴素 Top-k 只用堆顶需要选对最大堆或最小堆。遇到未知算法题，先在纸上写三行：**Input assumptions / Invariant / Output guarantee**，可以减少“方法正确但问题设定不符”的错误。

### E18. 输出型算法的复杂度要计入答案规模【拓展】

生成全部 n 位二进制串有 `2ⁿ` 个输出，每个串长度 n，完整打印至少需要 `Ω(n2ⁿ)` 的字符工作量；生成 n 个不同元素的全部排列有 `n!` 个，每个排列有 n 项，输出成本至少 `Ω(n·n!)`。因此即使递归代码“每层只做一个简单操作”，也不能把枚举输出题的总复杂度错误写成 `O(n)`。
