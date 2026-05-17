import { firebase } from '@/firebase/firebase.config';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';
import { useState } from 'react';

async function migrateUserId(oldId: string, newId: string): Promise<string> {
  const db = firebase.db;

  // 1. goals (userId field)
  const goalsDocs = await getDocs(query(collection(db, 'goals'), where('userId', '==', oldId)));

  // 2. goalDailyRecords (userId field)
  const recordsDocs = await getDocs(
    query(collection(db, 'goalDailyRecords'), where('userId', '==', oldId)),
  );

  // 3. fuelPaymentGroups (userIds array)
  const groupsDocs = await getDocs(
    query(collection(db, 'fuelPaymentGroups'), where('userIds', 'array-contains', oldId)),
  );

  // 4. Doc-ID-based collections
  const [budgetingDoc, fuelUserDoc, userDoc] = await Promise.all([
    getDoc(doc(db, 'budgeting', oldId)),
    getDoc(doc(db, 'fuelPaymentUsers', oldId)),
    getDoc(doc(db, 'users', oldId)),
  ]);

  const totalOps =
    goalsDocs.size +
    recordsDocs.size +
    groupsDocs.size * 2 + // arrayRemove + arrayUnion per group doc
    (budgetingDoc.exists() ? 2 : 0) +
    (fuelUserDoc.exists() ? 2 : 0) +
    (userDoc.exists() ? 2 : 0);

  if (totalOps === 0) {
    return `oldId "${oldId}"에 해당하는 데이터가 없습니다.`;
  }

  // Firestore batch limit = 500 ops. Split if needed.
  const batches: ReturnType<typeof writeBatch>[] = [];
  let current = writeBatch(db);
  let count = 0;

  const getOrNewBatch = () => {
    if (count >= 490) {
      batches.push(current);
      current = writeBatch(db);
      count = 0;
    }
    count++;
    return current;
  };

  // goals
  goalsDocs.forEach((d) => getOrNewBatch().update(d.ref, { userId: newId }));

  // goalDailyRecords
  recordsDocs.forEach((d) => getOrNewBatch().update(d.ref, { userId: newId }));

  // fuelPaymentGroups: replace oldId in array
  groupsDocs.forEach((d) => {
    const b1 = getOrNewBatch();
    b1.update(d.ref, { userIds: arrayRemove(oldId) });
    const b2 = getOrNewBatch();
    b2.update(d.ref, { userIds: arrayUnion(newId) });
  });

  // budgeting (doc ID = userId, also has `id` field = userId)
  if (budgetingDoc.exists()) {
    getOrNewBatch().set(doc(db, 'budgeting', newId), { ...budgetingDoc.data(), id: newId });
    getOrNewBatch().delete(doc(db, 'budgeting', oldId));
  }

  // fuelPaymentUsers (doc ID = userId)
  if (fuelUserDoc.exists()) {
    getOrNewBatch().set(doc(db, 'fuelPaymentUsers', newId), fuelUserDoc.data());
    getOrNewBatch().delete(doc(db, 'fuelPaymentUsers', oldId));
  }

  // users (doc ID = userId)
  if (userDoc.exists()) {
    getOrNewBatch().set(doc(db, 'users', newId), userDoc.data());
    getOrNewBatch().delete(doc(db, 'users', oldId));
  }

  batches.push(current);

  await Promise.all(batches.map((b) => b.commit()));

  const summary = [
    goalsDocs.size > 0 && `goals: ${goalsDocs.size}건`,
    recordsDocs.size > 0 && `goalDailyRecords: ${recordsDocs.size}건`,
    groupsDocs.size > 0 && `fuelPaymentGroups: ${groupsDocs.size}건`,
    budgetingDoc.exists() && `budgeting: 1건`,
    fuelUserDoc.exists() && `fuelPaymentUsers: 1건`,
    userDoc.exists() && `users: 1건`,
  ]
    .filter(Boolean)
    .join(', ');

  return `완료 — ${summary}`;
}

export function UserIdMigration() {
  const [open, setOpen] = useState(false);
  const [oldId, setOldId] = useState('');
  const [newId, setNewId] = useState('');
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'ok' | 'error'; msg: string }>(
    { type: 'idle', msg: '' },
  );

  const handleRun = async () => {
    if (!oldId.trim() || !newId.trim()) return;
    if (oldId.trim() === newId.trim()) {
      setStatus({ type: 'error', msg: 'oldId와 newId가 같습니다.' });
      return;
    }
    setStatus({ type: 'loading', msg: '실행 중...' });
    try {
      const msg = await migrateUserId(oldId.trim(), newId.trim());
      setStatus({ type: 'ok', msg });
    } catch (e) {
      setStatus({ type: 'error', msg: String(e) });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setOldId('');
    setNewId('');
    setStatus({ type: 'idle', msg: '' });
  };

  return (
    <>
      <Button
        variant="outlined"
        color="warning"
        size="small"
        onClick={() => setOpen(true)}
        sx={{ mt: 4 }}
      >
        userId 마이그레이션
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>userId 마이그레이션</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="기존 userId (oldId)"
              value={oldId}
              onChange={(e) => setOldId(e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="새 userId (newId)"
              value={newId}
              onChange={(e) => setNewId(e.target.value)}
              fullWidth
              size="small"
            />
            <Button
              variant="contained"
              color="warning"
              onClick={handleRun}
              disabled={status.type === 'loading' || !oldId.trim() || !newId.trim()}
              startIcon={status.type === 'loading' ? <CircularProgress size={16} /> : undefined}
            >
              실행
            </Button>
            {status.msg && (
              <Typography
                variant="body2"
                color={
                  status.type === 'error'
                    ? 'error'
                    : status.type === 'ok'
                      ? 'success.main'
                      : 'text.secondary'
                }
              >
                {status.msg}
              </Typography>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
