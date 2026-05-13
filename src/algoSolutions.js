export const ALGO_SOLUTIONS = {
    bubble: {
        JavaScript: `function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
        CPP: `#include <iostream>
#include <vector>
using namespace std;

void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}`,
        Python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`,
        Java: `public class BubbleSort {
    public void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
}`
    },
    selection: {
        JavaScript: `function selectionSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n; i++) {
    let min = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[min]) min = j;
    }
    [arr[i], arr[min]] = [arr[min], arr[i]];
  }
  return arr;
}`,
        CPP: `void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++)
            if (arr[j] < arr[min_idx])
                min_idx = j;
        swap(arr[min_idx], arr[i]);
    }
}`,
        Python: `def selection_sort(arr):
    for i in range(len(arr)):
        min_idx = i
        for j in range(i + 1, len(arr)):
            if arr[min_idx] > arr[j]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
        Java: `void selectionSort(int arr[]) {
    int n = arr.length;
    for (int i = 0; i < n-1; i++) {
        int min_idx = i;
        for (int j = i+1; j < n; j++)
            if (arr[j] < arr[min_idx])
                min_idx = j;
        int temp = arr[min_idx];
        arr[min_idx] = arr[i];
        arr[i] = temp;
    }
}`
    },
    insertion: {
        JavaScript: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
        CPP: `void insertionSort(vector<int>& arr) {
    for (int i = 1; i < arr.size(); i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`,
        Python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and key < arr[j]:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`,
        Java: `void insertionSort(int arr[]) {
    for (int i = 1; i < arr.length; ++i) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`
    },
    merge: {
        JavaScript: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  let result = [], i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}`,
        CPP: `void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1, n2 = r - m;
    int L[n1], R[n2];
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`,
        Python: `def merge_sort(arr):
    if len(arr) > 1:
        mid = len(arr)//2
        L = arr[:mid]
        R = arr[mid:]
        merge_sort(L)
        merge_sort(R)
        i = j = k = 0
        while i < len(L) and j < len(R):
            if L[i] < R[j]:
                arr[k] = L[i]; i += 1
            else:
                arr[k] = R[j]; j += 1
            k += 1
        while i < len(L):
            arr[k] = L[i]; i += 1; k += 1
        while j < len(R):
            arr[k] = R[j]; j += 1; k += 1`,
        Java: `void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1, n2 = r - m;
    int L[] = new int[n1], R[] = new int[n2];
    for (int i = 0; i < n1; ++i) L[i] = arr[l + i];
    for (int j = 0; j < n2; ++j) R[j] = arr[m + 1 + j];
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

void sort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        sort(arr, l, m);
        sort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`
    },
    quick: {
        JavaScript: `function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[arr.length - 1];
  const left = [], right = [];
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) left.push(arr[i]);
    else right.push(arr[i]);
  }
  return [...quickSort(left), pivot, ...quickSort(right)];
}`,
        CPP: `int partition(int arr[], int low, int high) {
    int pivot = arr[high], i = (low - 1);
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++; swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return (i + 1);
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
        Python: `def quick_sort(arr):
    if len(arr) <= 1: return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)`,
        Java: `int partition(int arr[], int low, int high) {
    int pivot = arr[high], i = (low - 1);
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return i + 1;
}

void sort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        sort(arr, low, pi - 1);
        sort(arr, pi + 1, high);
    }
}`
    },
    linear: {
        JavaScript: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`,
        CPP: `int linearSearch(int arr[], int n, int x) {
    for (int i = 0; i < n; i++)
        if (arr[i] == x) return i;
    return -1;
}`,
        Python: `def linear_search(arr, x):
    for i in range(len(arr)):
        if arr[i] == x: return i
    return -1`,
        Java: `public int search(int arr[], int x) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == x) return i;
    }
    return -1;
}`
    },
    binary: {
        JavaScript: `function binarySearch(arr, target) {
  let low = 0, high = arr.length - 1;
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
        CPP: `int binarySearch(int arr[], int l, int r, int x) {
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (arr[m] == x) return m;
        if (arr[m] < x) l = m + 1;
        else r = m - 1;
    }
    return -1;
}`,
        Python: `def binary_search(arr, x):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (high + low) // 2
        if arr[mid] == x: return mid
        elif arr[mid] < x: low = mid + 1
        else: high = mid - 1
    return -1`,
        Java: `int binarySearch(int arr[], int x) {
    int l = 0, r = arr.length - 1;
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (arr[m] == x) return m;
        if (arr[m] < x) l = m + 1;
        else r = m - 1;
    }
    return -1;
}`
    },
    bfs: {
        JavaScript: `function bfs(graph, start) {
  let queue = [start];
  let visited = new Set([start]);
  while (queue.length > 0) {
    let u = queue.shift();
    for (let v of graph[u]) {
      if (!visited.has(v)) {
        visited.add(v);
        queue.push(v);
      }
    }
  }
}`,
        CPP: `void BFS(int s, vector<int> adj[], int V) {
    vector<bool> visited(V, false);
    queue<int> q;
    visited[s] = true; q.push(s);
    while(!q.empty()) {
        s = q.front(); q.pop();
        for (auto i : adj[s]) {
            if (!visited[i]) {
                visited[i] = true; q.push(i);
            }
        }
    }
}`,
        Python: `def bfs(graph, start):
    visited, queue = {start}, [start]
    while queue:
        vertex = queue.pop(0)
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)`,
        Java: `void BFS(int s, LinkedList<Integer> adj[], int V) {
    boolean visited[] = new boolean[V];
    LinkedList<Integer> queue = new LinkedList<Integer>();
    visited[s]=true; queue.add(s);
    while (queue.size() != 0) {
        s = queue.poll();
        for (int n : adj[s]) {
            if (!visited[n]) {
                visited[n] = true; queue.add(n);
            }
        }
    }
}`
    },
    dfs: {
        JavaScript: `function dfs(graph, u, visited = new Set()) {
  visited.add(u);
  for (let v of graph[u]) {
    if (!visited.has(v)) {
      dfs(graph, v, visited);
    }
  }
}`,
        CPP: `void DFSUtil(int v, vector<int> adj[], vector<bool>& visited) {
    visited[v] = true;
    for (int i : adj[v])
        if (!visited[i]) DFSUtil(i, adj, visited);
}
void DFS(vector<int> adj[], int V) {
    vector<bool> visited(V, false);
    for (int i = 0; i < V; i++)
        if (!visited[i]) DFSUtil(i, adj, visited);
}`,
        Python: `def dfs(graph, start, visited=None):
    if visited is None: visited = set()
    visited.add(start)
    for next in graph[start] - visited:
        dfs(graph, next, visited)
    return visited`,
        Java: `void DFSUtil(int v, boolean visited[], LinkedList<Integer> adj[]) {
    visited[v] = true;
    for (int n : adj[v])
        if (!visited[n]) DFSUtil(n, visited, adj);
}
void DFS(int V, LinkedList<Integer> adj[]) {
    boolean visited[] = new boolean[V];
    for (int i = 0; i < V; ++i)
        if (!visited[i]) DFSUtil(i, visited, adj);
}`
    },
    dijkstra: {
        JavaScript: `function dijkstra(graph, start) {
  let distances = {}, prev = {}, pq = new PriorityQueue();
  for (let v in graph) { distances[v] = Infinity; prev[v] = null; }
  distances[start] = 0; pq.enqueue(start, 0);
  while (!pq.isEmpty()) {
    let { element: u } = pq.dequeue();
    for (let v in graph[u]) {
      let alt = distances[u] + graph[u][v];
      if (alt < distances[v]) {
        distances[v] = alt; prev[v] = u;
        pq.enqueue(v, distances[v]);
      }
    }
  }
  return distances;
}`,
        CPP: `void dijkstra(int src, vector<pair<int, int>> adj[], int V) {
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    vector<int> dist(V, INF);
    pq.push({0, src}); dist[src] = 0;
    while (!pq.empty()) {
        int u = pq.top().second; pq.pop();
        for (auto x : adj[u]) {
            int v = x.first, weight = x.second;
            if (dist[v] > dist[u] + weight) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }
}`,
        Python: `import heapq
def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    pq = [(0, start)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > distances[u]: continue
        for v, weight in graph[u].items():
            if distances[u] + weight < distances[v]:
                distances[v] = distances[u] + weight
                heapq.heappush(pq, (distances[v], v))
    return distances`,
        Java: `void dijkstra(int adj[][], int src, int V) {
    int dist[] = new int[V];
    Boolean sptSet[] = new Boolean[V];
    for (int i = 0; i < V; i++) {
        dist[i] = Integer.MAX_VALUE; sptSet[i] = false;
    }
    dist[src] = 0;
    for (int count = 0; count < V - 1; count++) {
        int u = minDistance(dist, sptSet, V);
        sptSet[u] = true;
        for (int v = 0; v < V; v++)
            if (!sptSet[v] && adj[u][v] != 0 && dist[u] != Integer.MAX_VALUE && dist[u] + adj[u][v] < dist[v])
                dist[v] = dist[u] + adj[u][v];
    }
}`
    },
    fibonacci: {
        JavaScript: `function fib(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 2) return 1;
  memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
  return memo[n];
}`,
        CPP: `int fib(int n) {
    int f[n + 2];
    f[0] = 0; f[1] = 1;
    for (int i = 2; i <= n; i++)
        f[i] = f[i - 1] + f[i - 2];
    return f[n];
}`,
        Python: `def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a`,
        Java: `int fib(int n) {
    int f[] = new int[n + 2];
    f[0] = 0; f[1] = 1;
    for (int i = 2; i <= n; i++)
        f[i] = f[i - 1] + f[i - 2];
    return f[n];
}`
    },
    gcd: {
        JavaScript: `function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}`,
        CPP: `int gcd(int a, int b) {
    if (b == 0) return a;
    return gcd(b, a % b);
}`,
        Python: `def gcd(a, b):
    while b: a, b = b, a % b
    return a`,
        Java: `static int gcd(int a, int b) {
    if (b == 0) return a;
    return gcd(b, a % b);
}`
    },
    sieve: {
        JavaScript: `function sieveOfEratosthenes(n) {
  let prime = Array(n + 1).fill(true);
  prime[0] = prime[1] = false;
  for (let p = 2; p * p <= n; p++) {
    if (prime[p]) {
      for (let i = p * p; i <= n; i += p) prime[i] = false;
    }
  }
  return prime.reduce((acc, isPrime, idx) => isPrime ? [...acc, idx] : acc, []);
}`,
        CPP: `void sieve(int n) {
    vector<bool> prime(n + 1, true);
    for (int p = 2; p * p <= n; p++) {
        if (prime[p] == true) {
            for (int i = p * p; i <= n; i += p)
                prime[i] = false;
        }
    }
}`,
        Python: `def sieve(n):
    prime = [True for i in range(n+1)]
    p = 2
    while (p * p <= n):
        if (prime[p] == True):
            for i in range(p * p, n+1, p):
                prime[i] = False
        p += 1
    return [p for p in range(2, n) if prime[p]]`,
        Java: `void sieveOfEratosthenes(int n) {
    boolean prime[] = new boolean[n+1];
    for(int i=0;i<=n;i++) prime[i] = true;
    for(int p = 2; p*p <= n; p++) {
        if(prime[p] == true) {
            for(int i = p*p; i <= n; i += p)
                prime[i] = false;
        }
    }
}`
    },
    knapsack: {
        JavaScript: `function knapSack(W, wt, val, n) {
  let K = Array.from({length: n + 1}, () => Array(W + 1).fill(0));
  for (let i = 0; i <= n; i++) {
    for (let w = 0; w <= W; w++) {
      if (i === 0 || w === 0) K[i][w] = 0;
      else if (wt[i - 1] <= w) K[i][w] = Math.max(val[i - 1] + K[i - 1][w - wt[i - 1]], K[i - 1][w]);
      else K[i][w] = K[i - 1][w];
    }
  }
  return K[n][W];
}`,
        CPP: `int knapSack(int W, int wt[], int val[], int n) {
    vector<vector<int>> K(n + 1, vector<int>(W + 1));
    for (int i = 0; i <= n; i++) {
        for (int w = 0; w <= W; w++) {
            if (i == 0 || w == 0) K[i][w] = 0;
            else if (wt[i - 1] <= w) K[i][w] = max(val[i - 1] + K[i - 1][w - wt[i - 1]], K[i - 1][w]);
            else K[i][w] = K[i - 1][w];
        }
    }
    return K[n][W];
}`,
        Python: `def knapSack(W, wt, val, n):
    K = [[0 for x in range(W + 1)] for x in range(n + 1)]
    for i in range(n + 1):
        for w in range(W + 1):
            if i == 0 or w == 0: K[i][w] = 0
            elif wt[i-1] <= w: K[i][w] = max(val[i-1] + K[i-1][w-wt[i-1]], K[i-1][w])
            else: K[i][w] = K[i-1][w]
    return K[n][W]`,
        Java: `int knapSack(int W, int wt[], int val[], int n) {
    int K[][] = new int[n + 1][W + 1];
    for (int i = 0; i <= n; i++) {
        for (int w = 0; w <= W; w++) {
            if (i == 0 || w == 0) K[i][w] = 0;
            else if (wt[i - 1] <= w) K[i][w] = Math.max(val[i - 1] + K[i - 1][w - wt[i - 1]], K[i - 1][w]);
            else K[i][w] = K[i - 1][w];
        }
    }
    return K[n][W];
}`
    },
    nqueens: {
        JavaScript: `function solveNQueens(n) {
  let res = [], board = Array.from({length: n}, () => Array(n).fill('.'));
  backtrack(0);
  return res;
  function backtrack(col) {
    if (col === n) { res.push(board.map(row => row.join(''))); return; }
    for (let i = 0; i < n; i++) {
      if (isSafe(i, col)) {
        board[i][col] = 'Q'; backtrack(col + 1); board[i][col] = '.';
      }
    }
  }
  function isSafe(row, col) {
    for (let i = 0; i < col; i++) if (board[row][i] === 'Q') return false;
    for (let i=row, j=col; i>=0 && j>=0; i--, j--) if (board[i][j] === 'Q') return false;
    for (let i=row, j=col; i<n && j>=0; i++, j--) if (board[i][j] === 'Q') return false;
    return true;
  }
}`,
        CPP: `bool isSafe(vector<vector<int>>& board, int row, int col, int N) {
    for (int i = 0; i < col; i++) if (board[row][i]) return false;
    for (int i = row, j = col; i >= 0 && j >= 0; i--, j--) if (board[i][j]) return false;
    for (int i = row, j = col; j >= 0 && i < N; i++, j--) if (board[i][j]) return false;
    return true;
}
bool solveNQUtil(vector<vector<int>>& board, int col, int N) {
    if (col >= N) return true;
    for (int i = 0; i < N; i++) {
        if (isSafe(board, i, col, N)) {
            board[i][col] = 1;
            if (solveNQUtil(board, col + 1, N)) return true;
            board[i][col] = 0;
        }
    }
    return false;
}`,
        Python: `def solveNQ(board, col, n):
    if col >= n: return True
    for i in range(n):
        if isSafe(board, i, col, n):
            board[i][col] = 1
            if solveNQ(board, col + 1, n): return True
            board[i][col] = 0
    return False`,
        Java: `boolean solveNQUtil(int board[][], int col, int N) {
    if (col >= N) return true;
    for (int i = 0; i < N; i++) {
        if (isSafe(board, i, col, N)) {
            board[i][col] = 1;
            if (solveNQUtil(board, col + 1, N)) return true;
            board[i][col] = 0;
        }
    }
    return false;
}`
    },
    sudoku: {
        JavaScript: `function solveSudoku(board) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === '.') {
        for (let c = 1; c <= 9; c++) {
          if (isValid(board, i, j, c.toString())) {
            board[i][j] = c.toString();
            if (solveSudoku(board)) return true;
            else board[i][j] = '.';
          }
        }
        return false;
      }
    }
  }
  return true;
}`,
        CPP: `bool solveSudoku(int grid[N][N]) {
    int row, col;
    if (!FindUnassignedLocation(grid, row, col)) return true;
    for (int num = 1; num <= 9; num++) {
        if (isSafe(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudoku(grid)) return true;
            grid[row][col] = UNASSIGNED;
        }
    }
    return false;
}`,
        Python: `def solve_sudoku(arr):
    l = [0, 0]
    if not find_empty_location(arr, l): return True
    row, col = l[0], l[1]
    for num in range(1, 10):
        if is_safe(arr, row, col, num):
            arr[row][col] = num
            if solve_sudoku(arr): return True
            arr[row][col] = 0
    return False`,
        Java: `public boolean solveSudoku(int[][] board) {
    for (int i = 0; i < 9; i++) {
        for (int j = 0; j < 9; j++) {
            if (board[i][j] == 0) {
                for (int n = 1; n <= 9; n++) {
                    if (isValid(board, i, j, n)) {
                        board[i][j] = n;
                        if (solveSudoku(board)) return true;
                        else board[i][j] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}`
    },
    heap: {
        JavaScript: `function heapSort(arr) {
  let n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(arr, n, i);
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}
function heapify(arr, n, i) {
  let largest = i, l = 2 * i + 1, r = 2 * i + 2;
  if (l < n && arr[l] > arr[largest]) largest = l;
  if (r < n && arr[r] > arr[largest]) largest = r;
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`,
        CPP: `void heapify(int arr[], int n, int i) {
    int largest = i, l = 2 * i + 1, r = 2 * i + 2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i) { swap(arr[i], arr[largest]); heapify(arr, n, largest); }
}
void heapSort(int arr[], int n) {
    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) { swap(arr[0], arr[i]); heapify(arr, i, 0); }
}`,
        Python: `def heapify(arr, n, i):
    largest = i; l = 2 * i + 1; r = 2 * i + 2
    if l < n and arr[i] < arr[l]: largest = l
    if r < n and arr[largest] < arr[r]: largest = r
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)
def heapSort(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1): heapify(arr, n, i)
    for i in range(n-1, 0, -1):
        arr[i], arr[0] = arr[0], arr[i]; heapify(arr, i, 0)`,
        Java: `void heapify(int arr[], int n, int i) {
    int largest = i, l = 2 * i + 1, r = 2 * i + 2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
        int swap = arr[i]; arr[i] = arr[largest]; arr[largest] = swap;
        heapify(arr, n, largest);
    }
}
public void sort(int arr[]) {
    int n = arr.length;
    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        int temp = arr[0]; arr[0] = arr[i]; arr[i] = temp;
        heapify(arr, i, 0);
    }
}`
    },
    jump: {
        JavaScript: `function jumpSearch(arr, x) {
  let n = arr.length; let step = Math.floor(Math.sqrt(n)); let prev = 0;
  while (arr[Math.min(step, n) - 1] < x) {
    prev = step; step += Math.floor(Math.sqrt(n));
    if (prev >= n) return -1;
  }
  while (arr[prev] < x) {
    prev++;
    if (prev === Math.min(step, n)) return -1;
  }
  if (arr[prev] === x) return prev;
  return -1;
}`,
        CPP: `int jumpSearch(int arr[], int x, int n) {
    int step = sqrt(n); int prev = 0;
    while (arr[min(step, n)-1] < x) {
        prev = step; step += sqrt(n);
        if (prev >= n) return -1;
    }
    while (arr[prev] < x) {
        prev++;
        if (prev == min(step, n)) return -1;
    }
    if (arr[prev] == x) return prev;
    return -1;
}`,
        Python: `import math
def jumpSearch(arr, x, n):
    step = math.sqrt(n); prev = 0
    while arr[int(min(step, n) - 1)] < x:
        prev = step; step += math.sqrt(n)
        if prev >= n: return -1
    while arr[int(prev)] < x:
        prev += 1
        if prev == min(step, n): return -1
    if arr[int(prev)] == x: return prev
    return -1`,
        Java: `public int jumpSearch(int[] arr, int x) {
    int n = arr.length; int step = (int)Math.floor(Math.sqrt(n)); int prev = 0;
    while (arr[Math.min(step, n) - 1] < x) {
        prev = step; step += (int)Math.floor(Math.sqrt(n));
        if (prev >= n) return -1;
    }
    while (arr[prev] < x) {
        prev++;
        if (prev == Math.min(step, n)) return -1;
    }
    if (arr[prev] == x) return prev;
    return -1;
}`
    },
    shell: {
        JavaScript: `function shellSort(arr) {
  let n = arr.length;
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      let temp = arr[i], j;
      for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
        arr[j] = arr[j - gap];
      }
      arr[j] = temp;
    }
  }
  return arr;
}`,
        CPP: `void shellSort(int arr[], int n) {
    for (int gap = n/2; gap > 0; gap /= 2) {
        for (int i = gap; i < n; i += 1) {
            int temp = arr[i], j;
            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap)
                arr[j] = arr[j - gap];
            arr[j] = temp;
        }
    }
}`,
        Python: `def shellSort(arr):
    n = len(arr); gap = n // 2
    while gap > 0:
        for i in range(gap, n):
            temp = arr[i]; j = i
            while j >= gap and arr[j - gap] > temp:
                arr[j] = arr[j - gap]; j -= gap
            arr[j] = temp
        gap //= 2`,
        Java: `void sort(int arr[]) {
    int n = arr.length;
    for (int gap = n/2; gap > 0; gap /= 2) {
        for (int i = gap; i < n; i += 1) {
            int temp = arr[i], j;
            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap)
                arr[j] = arr[j - gap];
            arr[j] = temp;
        }
    }
}`
    }
};

export const CP_TEMPLATES = {
    'C++ 17': `#include <bits/stdc++.h>
using namespace std;

/**
 * Zen CP Template
 * Optimized for competitive programming
 */

#define fastio ios_base::sync_with_stdio(false); cin.tie(NULL); cout.tie(NULL);
#define ll long long
#define pb push_back
#define mp make_pair
#define all(x) x.begin(), x.end()
#define sz(x) (int)(x).size()

void solve() {
    // Write your logic here
}

int main() {
    fastio;
    int t = 1;
    // cin >> t; // Uncomment for multiple test cases
    while (t--) {
        solve();
    }
    return 0;
}`,
    'Python 3': `import sys

# Increase recursion depth for deep DFS
sys.setrecursionlimit(2000)

def input():
    return sys.stdin.readline().rstrip()

def solve():
    # Write your logic here
    pass

if __name__ == "__main__":
    solve()`,
    'Java': `import java.util.*;
import java.io.*;

public class Main {
    static class FastReader {
        BufferedReader br;
        StringTokenizer st;

        public FastReader() {
            br = new BufferedReader(new InputStreamReader(System.in));
        }

        String next() {
            while (st == null || !st.hasMoreElements()) {
                try {
                    st = new StringTokenizer(br.readLine());
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            return st.nextToken();
        }

        int nextInt() { return Integer.parseInt(next()); }
        long nextLong() { return Long.parseLong(next()); }
        double nextDouble() { return Double.parseDouble(next()); }
    }

    public static void main(String[] args) {
        FastReader fr = new FastReader();
        PrintWriter out = new PrintWriter(System.out);

        // solve here

        out.flush();
    }
}`,
    'JavaScript': `const fs = require('fs');

const input = fs.readFileSync(0, 'utf8').split('\\n');
let currentLine = 0;

function readLine() {
    return input[currentLine++];
}

function solve() {
    // Write your logic here
}

solve();`
};
