# Contributing

Thanks for helping improve QuizzMaster.

## Setup
- Backend: `cd backend && npm ci`.
- Frontend: `cd frontend && npm ci`.
- Use local environment values based on `backend/.env.example`.

## Contribution guidance
Keep scoring deterministic and treat authentication, quiz submission, and leaderboard changes as correctness-sensitive. Bug fixes should include reproduction steps and expected behavior.

## Pull request checklist
- [ ] Backend source passes syntax checks.
- [ ] Frontend builds successfully.
- [ ] Scoring and validation edge cases were checked.
- [ ] Auth-protected routes remain protected.
- [ ] No credentials or generated artifacts are committed.
