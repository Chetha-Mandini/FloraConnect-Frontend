# Keeping local main synchronized

Commit changes on a feature branch and open a PR instead of pushing directly to main.

```sh
git switch main
git pull --ff-only origin main
git switch -c fix/describe-your-change
# Implement, validate and commit changes.
git push -u origin HEAD
```

If a pull reports conflicts, do not retry pushing: the merge is unfinished. Run `git status`, inspect each conflicted file, and combine the intended changes while removing conflict markers. Stage only resolved files, run lint, tests and build, then complete the merge with `git commit`. Preserve local work on a backup branch before reconciling redundant local commits with remote main. Do not discard files or force-push shared main.

A non-fast-forward rejection means the remote has commits absent locally. Use `git fetch origin` and `git log --oneline --graph --decorate -12` to inspect the history. If local and remote application changes are already identical, avoid opening a duplicate application PR. Submit only remaining changes on a branch.

An `ort` merge message means a pull succeeded; a conflict message means it still requires resolution. `git pull` contains a space.
