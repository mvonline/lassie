# Movie Rental Refactoring

This project is a cleanup of some old movie rental code. I've turned it into a modern version that's easier to read and less likely to break.

## What I Fixed

I didn't just move things around; I fixed a few hidden bugs that were in the original code:

*   **Handling Unknown Movies**: The old code would charge £0 if it didn't recognize a movie type. Now, it will tell you exactly what's wrong instead of giving away free rentals.
*   **Safety First**: If a movie was missing from the list, the old code would crash. I added a check to make sure everything is where it should be before the calculation starts.
*   **No More Mystery Numbers**: Instead of using random numbers like `1.5` or `3` in the middle of the logic, I've put them in a clear list at the top so anyone can see (and change) the rates easily.
*   **Clean Design**: I split the "math" from the "printing." This means if we ever want to make an HTML version of the receipt, we don't have to touch the calculation logic.

---

## How to Test It

Since both the old and new code are here, I've included a test to make sure they still give the **exact same results**. This is to prove that my cleanup didn't change how much customers are charged.

To run the test, use this command in your terminal:

```bash
node --experimental-strip-types compare.test.ts
```

This will run several scenarios (like long rentals and new releases) and confirm that both files agree on the final bill.
