# Git Workflow Guidelines
### 🚀 Starting Phase
1. **Pull the latest changes from `main`**
   
2. **Create a new branch for your work**

    - Keep branch names **short and meaningful**.

    - Examples:
        - ✅ `feature/dashboard`
        - ✅ `fix/login-bug`
        - ❌ `fixing-login-issue-that-happens-when-user-clicks-button`

3. **Make your changes and commit them**
    - Use **Present Tense**.
    - Format: `Action(File): Short message`

        ```sh
        git commit -m "Fix(auth): token expiration logic"
        ```

4. **Push the branch and raise a Pull Request (PR) against `main`**

5. **Avoid including already merged commits in the PR!**  


### (After PR Merge)
1. **Delete the merged branch** (PR reviewer/merger is responsible for this).

2. **Sync your local repo with the latest `main`** before starting new work.

3. **Start a new branch for your next task** (Repeat steps from the starting phase).

### 🔍 Example PR's
https://github.com/incubyte/goalcraft/pull/14
### 🔄 Clean Up Old Local Branches
To remove local branches that no longer exist on remote:
```sh
git fetch --prune
```
