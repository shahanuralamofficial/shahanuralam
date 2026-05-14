
// Algorithm Logic for AlgoLab

export const runBubbleSort = async (helpers) => {
    const { visArray, setVisArray, setVisPointers, setStepDescription, playTone, delay, playSuccessSound, setIsVisSorting } = helpers;
    setIsVisSorting(true);
    let arr = [...visArray];
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            setVisPointers(prev => ({ ...prev, active: [j, j + 1] }));
            setStepDescription(`Comparing ${arr[j]} and ${arr[j + 1]}`);
            playTone(200 + arr[j] * 5); await delay();
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                setVisArray([...arr]); await delay();
            }
        }
    }
    setVisPointers(prev => ({ ...prev, active: [] }));
    setStepDescription('Bubble Sort Complete!'); playSuccessSound(); setIsVisSorting(false);
};

export const runSelectionSort = async (helpers) => {
    const { visArray, setVisArray, setVisPointers, setStepDescription, playTone, delay, playSuccessSound, setIsVisSorting } = helpers;
    setIsVisSorting(true);
    let arr = [...visArray];
    for (let i = 0; i < arr.length; i++) {
        let min = i;
        for (let j = i + 1; j < arr.length; j++) {
            setVisPointers(prev => ({ ...prev, active: [j], mid: min, left: i }));
            setStepDescription(`Looking for minimum. Current min is ${arr[min]}`);
            playTone(300 + j * 10); await delay();
            if (arr[j] < arr[min]) min = j;
        }
        [arr[i], arr[min]] = [arr[min], arr[i]];
        setVisArray([...arr]); await delay();
    }
    setStepDescription('Selection Sort Complete!'); playSuccessSound(); setIsVisSorting(false);
};

export const runInsertionSort = async (helpers) => {
    const { visArray, setVisArray, setVisPointers, setStepDescription, playTone, delay, playSuccessSound, setIsVisSorting } = helpers;
    setIsVisSorting(true);
    let arr = [...visArray];
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i]; let j = i - 1;
        setStepDescription(`Inserting ${key} into sorted portion`);
        while (j >= 0 && arr[j] > key) {
            setVisPointers(prev => ({ ...prev, active: [j, j + 1] }));
            arr[j + 1] = arr[j]; setVisArray([...arr]);
            playTone(300 + j * 10); await delay(); j--;
        }
        arr[j + 1] = key; setVisArray([...arr]); await delay();
    }
    setStepDescription('Insertion Sort Complete!'); playSuccessSound(); setIsVisSorting(false);
};

export const runMergeSort = async (helpers) => {
    const { visArray, setVisArray, setVisPointers, setStepDescription, playTone, delay, playSuccessSound, setIsVisSorting } = helpers;
    setIsVisSorting(true);
    let arr = [...visArray];
    const merge = async (l, m, r) => {
        let n1 = m - l + 1; let n2 = r - m;
        let L = arr.slice(l, m + 1); let R = arr.slice(m + 1, r + 1);
        let i = 0, j = 0, k = l;
        while (i < n1 && j < n2) {
            setVisPointers(prev => ({ ...prev, active: [l + i, m + 1 + j], secondary: [k] }));
            playTone(200 + arr[k] * 5); await delay();
            if (L[i] <= R[j]) { arr[k] = L[i]; i++; } else { arr[k] = R[j]; j++; }
            setVisArray([...arr]); k++;
        }
        while (i < n1) { arr[k] = L[i]; i++; k++; setVisArray([...arr]); await delay(); }
        while (j < n2) { arr[k] = R[j]; j++; k++; setVisArray([...arr]); await delay(); }
    };
    const sort = async (l, r) => {
        if (l >= r) return;
        let m = l + Math.floor((r - l) / 2);
        await sort(l, m); await sort(m + 1, r); await merge(l, m, r);
    };
    await sort(0, arr.length - 1);
    setStepDescription('Merge Sort Complete!'); playSuccessSound(); setIsVisSorting(false);
};

export const runQuickSort = async (helpers) => {
    const { visArray, setVisArray, setVisPointers, setStepDescription, playTone, delay, playSuccessSound, setIsVisSorting } = helpers;
    setIsVisSorting(true);
    let arr = [...visArray];
    const partition = async (low, high) => {
        let pivot = arr[high]; let i = low - 1;
        setVisPointers(prev => ({ ...prev, mid: high }));
        for (let j = low; j < high; j++) {
            setVisPointers(prev => ({ ...prev, active: [j, high], left: i + 1 }));
            playTone(200 + arr[j] * 5); await delay();
            if (arr[j] < pivot) { i++; [arr[i], arr[j]] = [arr[j], arr[i]]; setVisArray([...arr]); await delay(); }
        }
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]; setVisArray([...arr]); await delay();
        return i + 1;
    };
    const sort = async (low, high) => {
        if (low < high) {
            let pi = await partition(low, high); await sort(low, pi - 1); await sort(pi + 1, high);
        }
    };
    await sort(0, arr.length - 1);
    setStepDescription('Quick Sort Complete!'); playSuccessSound(); setIsVisSorting(false);
};

export const runLinearSearch = async (helpers) => {
    const { visArray, setVisPointers, setStepDescription, playTone, delay, playSuccessSound, setIsVisSorting } = helpers;
    setIsVisSorting(true);
    let arr = [...visArray];
    let target = arr[Math.floor(Math.random() * arr.length)];
    setStepDescription(`Searching for: ${target}`);
    for (let i = 0; i < arr.length; i++) {
        setVisPointers(prev => ({ ...prev, active: [i] }));
        setStepDescription(`Checking index ${i}: ${arr[i]}`);
        playTone(300 + i * 20); await delay();
        if (arr[i] === target) { setStepDescription(`Match found at index ${i}!`); playSuccessSound(); setIsVisSorting(false); return; }
    }
    setStepDescription('Target not found.'); setIsVisSorting(false);
};

export const runBinarySearch = async (helpers) => {
    const { visArray, setVisArray, setVisPointers, setStepDescription, playTone, delay, playSuccessSound, setIsVisSorting } = helpers;
    setIsVisSorting(true);
    let arr = [...visArray].sort((a, b) => a - b); setVisArray(arr);
    let target = arr[Math.floor(Math.random() * arr.length)];
    setStepDescription(`Searching for: ${target}`);
    let low = 0, high = arr.length - 1;
    while (low <= high) {
        let mid = low + Math.floor((high - low) / 2);
        setVisPointers(prev => ({ ...prev, left: low, right: high, mid: mid, active: [] }));
        setStepDescription(`Checking middle index ${mid}: ${arr[mid]}`);
        playTone(400 + mid * 20); await delay();
        if (arr[mid] === target) {
            setVisPointers(prev => ({ ...prev, active: [mid] }));
            setStepDescription(`Found ${target} at index ${mid}!`); playSuccessSound(); break;
        } else if (arr[mid] < target) { setStepDescription(`${arr[mid]} < ${target}, search right.`); low = mid + 1; }
        else { setStepDescription(`${arr[mid]} > ${target}, search left.`); high = mid - 1; }
        await delay();
    }
    setIsVisSorting(false);
};

export const runBFS = async (helpers) => {
    const { setVisGrid, setVisPointers, playTone, delay, playSuccessSound, setIsVisSorting } = helpers;
    setIsVisSorting(true);
    let grid = Array(100).fill(0); const start = 0, end = 99; grid[start] = 1; grid[end] = 2;
    let queue = [start]; let visited = new Set([start]);
    const neighbors = (u) => {
        let n = []; let r = Math.floor(u / 10), c = u % 10;
        if (r > 0) n.push(u - 10); if (r < 9) n.push(u + 10); if (c > 0) n.push(u - 1); if (c < 9) n.push(u + 1);
        return n;
    };
    while (queue.length > 0) {
        let u = queue.shift(); if (u === end) break;
        setVisPointers(prev => ({ ...prev, active: [u] }));
        for (let v of neighbors(u)) {
            if (!visited.has(v)) {
                visited.add(v); grid[v] = grid[v] === 2 ? 2 : 3;
                setVisGrid([...grid]); playTone(400 + v * 5); await delay();
                queue.push(v);
            }
        }
    }
    playSuccessSound(); setIsVisSorting(false);
};

export const runDFS = async (helpers) => {
    const { setVisGrid, playTone, delay, playSuccessSound, setIsVisSorting } = helpers;
    setIsVisSorting(true);
    let grid = Array(100).fill(0); const end = 99; grid[end] = 2;
    let visited = new Set();
    const neighbors = (u) => {
        let n = []; let r = Math.floor(u / 10), c = u % 10;
        if (r < 9) n.push(u + 10); if (c < 9) n.push(u + 1); if (r > 0) n.push(u - 10); if (c > 0) n.push(u - 1);
        return n;
    };
    const dfs = async (u) => {
        if (u === end || visited.has(u)) return u === end;
        visited.add(u); grid[u] = 3; setVisGrid([...grid]);
        playTone(300 + u * 5); await delay();
        for (let v of neighbors(u)) if (await dfs(v)) return true;
        return false;
    };
    await dfs(0); playSuccessSound(); setIsVisSorting(false);
};

export const runFibonacciDP = async (helpers) => {
    const { setVisArray, setVisPointers, setStepDescription, playTone, delay, playSuccessSound, setIsVisSorting } = helpers;
    setIsVisSorting(true);
    let n = 12; let dp = Array(n).fill(0);
    setVisArray(dp);
    dp[0] = 5; dp[1] = 5; setVisArray([...dp]); await delay();
    setStepDescription("Base cases: fib(0)=1, fib(1)=1");
    for (let i = 2; i < n; i++) {
        setVisPointers({ active: [i - 1, i - 2], mid: i });
        setStepDescription(`fib(${i}) = fib(${i - 1}) + fib(${i - 2})`);
        dp[i] = dp[i - 1] + dp[i - 2];
        playTone(300 + dp[i] * 2);
        setVisArray([...dp]); await delay();
    }
    setStepDescription("DP Table filled!"); playSuccessSound(); setIsVisSorting(false);
};

export const runNQueens = async (helpers) => {
    const { setVisGrid, setStepDescription, playTone, delay, playSuccessSound, setIsVisSorting } = helpers;
    setIsVisSorting(true);
    let n = 8; let board = Array(n * n).fill(0);
    const isSafe = (r, c) => {
        for (let i = 0; i < c; i++) if (board[r * n + i] === 1) return false;
        for (let i = r, j = c; i >= 0 && j >= 0; i--, j--) if (board[i * n + j] === 1) return false;
        for (let i = r, j = c; j >= 0 && i < n; i++, j--) if (board[i * n + j] === 1) return false;
        return true;
    };
    const solve = async (col) => {
        if (col >= n) return true;
        for (let i = 0; i < n; i++) {
            setStepDescription(`Trying Queen at (${i}, ${col})`);
            board[i * n + col] = 3; setVisGrid([...board]); playTone(400 + i * 50); await delay();
            if (isSafe(i, col)) {
                board[i * n + col] = 1; setVisGrid([...board]);
                if (await solve(col + 1)) return true;
            }
            board[i * n + col] = 0; setVisGrid([...board]);
            setStepDescription(`Backtracking from (${i}, ${col})`); await delay();
        }
        return false;
    };
    await solve(0);
    setStepDescription("N-Queens Solved!"); playSuccessSound(); setIsVisSorting(false);
};

export const runSudoku = async (helpers) => {
    const { setVisGrid, setStepDescription, playTone, delay, playSuccessSound, setIsVisSorting } = helpers;
    setIsVisSorting(true);
    let board = [
        5, 3, 0, 0, 7, 0, 0, 0, 0,
        6, 0, 0, 1, 9, 5, 0, 0, 0,
        0, 9, 8, 0, 0, 0, 0, 6, 0,
        8, 0, 0, 0, 6, 0, 0, 0, 3,
        4, 0, 0, 8, 0, 3, 0, 0, 1,
        7, 0, 0, 0, 2, 0, 0, 0, 6,
        0, 6, 0, 0, 0, 0, 2, 8, 0,
        0, 0, 0, 4, 1, 9, 0, 0, 5,
        0, 0, 0, 0, 8, 0, 0, 7, 9
    ];
    // Pad to 100 for our 10x10 grid display
    let fullGrid = Array(100).fill(0);
    board.forEach((val, i) => { let r = Math.floor(i / 9), c = i % 9; fullGrid[r * 10 + c] = val; });
    setVisGrid([...fullGrid]);

    const isSafe = (r, c, num) => {
        for (let i = 0; i < 9; i++) if (board[r * 9 + i] === num) return false;
        for (let i = 0; i < 9; i++) if (board[i * 9 + c] === num) return false;
        let sr = r - r % 3, sc = c - c % 3;
        for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (board[(sr + i) * 9 + sc + j] === num) return false;
        return true;
    };

    const solve = async () => {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (board[r * 9 + c] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (isSafe(r, c, num)) {
                            board[r * 9 + c] = num;
                            fullGrid[r * 10 + c] = num; setVisGrid([...fullGrid]);
                            setStepDescription(`Placing ${num} at (${r},${c})`);
                            playTone(400 + num * 30); await delay();
                            if (await solve()) return true;
                            board[r * 9 + c] = 0;
                            fullGrid[r * 10 + c] = 3; // Highlight backtrack
                            setVisGrid([...fullGrid]); await delay();
                            fullGrid[r * 10 + c] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    };
    await solve();
    setStepDescription("Sudoku Solved!"); playSuccessSound(); setIsVisSorting(false);
};

export const runSieve = async (helpers) => {
    const { setVisGrid, setStepDescription, playTone, delay, playSuccessSound, setIsVisSorting, setVisPointers } = helpers;
    setIsVisSorting(true);
    let n = 100; let grid = Array(n).fill(0); grid[0] = 2; // 1 is not prime
    setVisGrid([...grid]);
    for (let p = 2; p * p <= n; p++) {
        if (grid[p - 1] === 0) {
            setVisPointers(prev => ({ ...prev, mid: p }));
            setStepDescription(`Checking multiples of ${p}`);
            playTone(400 + p * 5);
            for (let i = p * p; i <= n; i += p) {
                grid[i - 1] = 2; // Mark as composite
                setVisGrid([...grid]); await delay();
            }
        }
    }
    setVisPointers(prev => ({ ...prev, mid: -1 }));
    for (let i = 0; i < n; i++) if (grid[i] === 0) grid[i] = 3; // Primes
    setVisGrid([...grid]);
    setStepDescription("Primes highlighted in Green!"); playSuccessSound(); setIsVisSorting(false);
};

export const runKnapsack = async (helpers) => {
    const { setTableData, setVisPointers, setStepDescription, playTone, delay, playSuccessSound, setIsVisSorting } = helpers;
    setIsVisSorting(true);
    let values = [60, 100, 120]; let weights = [1, 2, 3]; let W = 5; let n = values.length;
    let dp = Array(n + 1).fill(0).map(() => Array(W + 1).fill(0));
    setTableData({
        rows: ["0", "Item 1 (1kg)", "Item 2 (2kg)", "Item 3 (3kg)"],
        cols: ["0", "1kg", "2kg", "3kg", "4kg", "5kg"],
        data: dp
    });

    for (let i = 1; i <= n; i++) {
        for (let w = 1; w <= W; w++) {
            setVisPointers({ mid: i, left: w });
            if (weights[i - 1] <= w) {
                setStepDescription(`Comparing taking item ${i} vs not.`);
                dp[i][w] = Math.max(values[i - 1] + dp[i - 1][w - weights[i - 1]], dp[i - 1][w]);
            } else {
                setStepDescription(`Item ${i} too heavy, copying from above.`);
                dp[i][w] = dp[i - 1][w];
            }
            setTableData(prev => ({ ...prev, data: [...dp] }));
            playTone(300 + dp[i][w]); await delay();
        }
    }
    setStepDescription("DP Table Complete! Result: " + dp[n][W]); playSuccessSound(); setIsVisSorting(false);
};

export const runDijkstra = async (helpers) => {
    const { setVisGrid, setVisPointers, playTone, delay, playSuccessSound, setIsVisSorting } = helpers;
    setIsVisSorting(true);
    let grid = Array(100).fill(0); let dist = Array(100).fill(Infinity);
    const start = 0, end = 99; dist[start] = 0; grid[start] = 1; grid[end] = 2;
    let pq = [[0, start]];
    const neighbors = (u) => {
        let n = []; let r = Math.floor(u / 10), c = u % 10;
        if (r > 0) n.push(u - 10); if (r < 9) n.push(u + 10); if (c > 0) n.push(u - 1); if (c < 9) n.push(u + 1);
        return n;
    };
    while (pq.length > 0) {
        pq.sort((a, b) => a[0] - b[0]);
        let [d, u] = pq.shift(); if (u === end) break;
        if (d > dist[u]) continue;
        setVisPointers(prev => ({ ...prev, active: [u] }));
        for (let v of neighbors(u)) {
            let weight = 1; // Simplified for grid
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                grid[v] = grid[v] === 2 ? 2 : 3;
                setVisGrid([...grid]); playTone(500 + dist[v] * 20); await delay();
                pq.push([dist[v], v]);
            }
        }
    }
    playSuccessSound(); setIsVisSorting(false);
};

export const runEuclideanGCD = async (helpers) => {
    const { setVisArray, setVisPointers, setStepDescription, playTone, delay, playSuccessSound, setIsVisSorting } = helpers;
    setIsVisSorting(true);
    let a = Math.floor(Math.random() * 50) + 40;
    let b = Math.floor(Math.random() * 30) + 10;
    let arr = [a, b]; setVisArray(arr);
    setStepDescription(`Finding GCD of ${a} and ${b}`);
    while (b !== 0) {
        setVisPointers({ active: [0, 1] });
        setStepDescription(`${a} % ${b} = ${a % b}`);
        playTone(400); await delay();
        a = b; b = arr[0] % b;
        arr = [a, b]; setVisArray([...arr]); await delay();
    }
    setStepDescription(`GCD is ${a}`); playSuccessSound(); setIsVisSorting(false);
};

export const runJumpSearch = async (helpers) => {
    const { visArray, setVisArray, setVisPointers, setStepDescription, playTone, delay, playSuccessSound, setIsVisSorting } = helpers;
    setIsVisSorting(true);
    let arr = [...visArray].sort((a, b) => a - b); setVisArray(arr);
    let n = arr.length; let target = arr[Math.floor(Math.random() * n)];
    let step = Math.floor(Math.sqrt(n)); let prev = 0;
    setStepDescription(`Searching for ${target} with jump size ${step}`);

    while (arr[Math.min(step, n) - 1] < target) {
        setVisPointers({ active: [Math.min(step, n) - 1] });
        setStepDescription(`Jumping to index ${Math.min(step, n) - 1}`);
        playTone(300 + step * 10); await delay();
        prev = step; step += Math.floor(Math.sqrt(n));
        if (prev >= n) { setStepDescription("Not found."); setIsVisSorting(false); return; }
    }

    setStepDescription(`Target might be between ${prev} and ${Math.min(step, n) - 1}. Linear searching...`);
    while (arr[prev] < target) {
        setVisPointers({ active: [prev] });
        playTone(400 + prev * 10); await delay();
        prev++;
        if (prev === Math.min(step, n)) { setStepDescription("Not found."); setIsVisSorting(false); return; }
    }

    if (arr[prev] === target) {
        setVisPointers({ active: [prev] });
        setStepDescription(`Found ${target} at index ${prev}!`); playSuccessSound();
    } else {
        setStepDescription("Not found.");
    }
    setIsVisSorting(false);
};

export const runHeapSort = async (helpers) => {
    const { visArray, setVisArray, setVisPointers, setStepDescription, playTone, delay, playSuccessSound, setIsVisSorting } = helpers;
    setIsVisSorting(true);
    let arr = [...visArray]; let n = arr.length;
    const heapify = async (n, i) => {
        let largest = i; let l = 2 * i + 1; let r = 2 * i + 2;
        if (l < n && arr[l] > arr[largest]) largest = l;
        if (r < n && arr[r] > arr[largest]) largest = r;
        if (largest !== i) {
            setVisPointers({ active: [i, largest] });
            playTone(300 + arr[largest] * 5); await delay();
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            setVisArray([...arr]);
            await heapify(n, largest);
        }
    };
    setStepDescription("Building Max Heap...");
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) await heapify(n, i);
    setStepDescription("Extracting elements from heap...");
    for (let i = n - 1; i > 0; i--) {
        setVisPointers({ active: [0, i] });
        playTone(400 + arr[i] * 5); await delay();
        [arr[0], arr[i]] = [arr[i], arr[0]];
        setVisArray([...arr]);
        await heapify(i, 0);
    }
    setStepDescription("Heap Sort Complete!"); playSuccessSound(); setIsVisSorting(false);
};

export const runShellSort = async (helpers) => {
    const { visArray, setVisArray, setVisPointers, setStepDescription, playTone, delay, playSuccessSound, setIsVisSorting } = helpers;
    setIsVisSorting(true);
    let arr = [...visArray];
    let n = arr.length;

    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        setStepDescription(`Current gap size: ${gap}`);
        for (let i = gap; i < n; i++) {
            let temp = arr[i];
            let j;
            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
                setVisPointers(prev => ({ ...prev, active: [j, j - gap] }));
                setStepDescription(`Comparing ${arr[j - gap]} and ${temp} with gap ${gap}`);
                playTone(300 + arr[j - gap] * 5); await delay();
                arr[j] = arr[j - gap];
                setVisArray([...arr]);
                await delay();
            }
            arr[j] = temp;
            setVisArray([...arr]);
        }
    }
    setVisPointers(prev => ({ ...prev, active: [] }));
    setStepDescription('Shell Sort Complete!'); playSuccessSound(); setIsVisSorting(false);
};
