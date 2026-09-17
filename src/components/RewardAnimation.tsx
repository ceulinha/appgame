import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { RewardPayload } from '../types';

interface RewardAnimationProps {
  reward: RewardPayload;
  onClose: () => void;
}

export default function RewardAnimation({ reward, onClose }: RewardAnimationProps) {
  useEffect(() => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#FFB800', '#FF6B5B', '#6C5CE7', '#2AD9B8'],
      scalar: 0.9,
    });
    const t = setTimeout(onClose, 2200);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-sm px-6"
      onClick={onClose}
    >
      <div className="animate-pop-in w-full max-w-xs rounded-3xl bg-white p-6 text-center shadow-2xl">
        {reward.leveledUp ? (
          <>
            <p className="text-5xl">🎉</p>
            <p className="mt-2 font-display text-xl font-extrabold text-violet">Subiu de nível!</p>
            <p className="font-display text-3xl font-extrabold text-ink mt-1">Nível {reward.newLevel}</p>
          </>
        ) : (
          <>
            <p className="text-5xl">🎉</p>
            <p className="mt-2 font-display text-lg font-extrabold text-ink">Missão completa!</p>
          </>
        )}

        <div className="mt-4 flex justify-center gap-4">
          <div className="animate-float-up flex flex-col items-center">
            <span className="text-2xl">⭐</span>
            <span className="font-display font-bold text-gold">+{reward.xp}</span>
          </div>
          <div className="animate-float-up flex flex-col items-center" style={{ animationDelay: '0.1s' }}>
            <span className="text-2xl">🪙</span>
            <span className="font-display font-bold text-[#B8860B]">+{reward.coins}</span>
          </div>
          {reward.money > 0 && (
            <div className="animate-float-up flex flex-col items-center" style={{ animationDelay: '0.2s' }}>
              <span className="text-2xl">💰</span>
              <span className="font-display font-bold text-mint">
                +R$ {reward.money.toFixed(2).replace('.', ',')}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
