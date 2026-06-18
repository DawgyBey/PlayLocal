import { Router } from 'express';
import { register, login, googleLogin, updateProfile } from '../controllers/auth.controller.js';
import { getMatches, createMatch, joinMatch, getMatch, postMessage } from '../controllers/match.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validateBody, registerSchema, matchSchema, messageSchema } from '../config/validation.js';

const router = Router();

// Auth Pipelines
router.post('/auth/register', validateBody(registerSchema), register);
router.post('/auth/login', login);
router.post('/auth/google', googleLogin);
router.patch('/auth/profile', protect, updateProfile);

// Match Core Pipelines
router.get('/matches', getMatches);
router.get('/matches/:id', getMatch);
router.post('/matches', protect, validateBody(matchSchema), createMatch);
router.post('/matches/:id/join', protect, joinMatch);
router.post('/matches/:id/messages', protect, validateBody(messageSchema), postMessage);

export default router;