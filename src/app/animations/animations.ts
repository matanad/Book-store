import {
  trigger,
  transition,
  style,
  animate,
  query,
} from '@angular/animations';

export const fadeAnimation = trigger('fadeAnimation', [
  transition('* <=> *', [
    query(':enter', [style({ opacity: 0, transform: 'translateX(120%)' })], {
      optional: true,
    }),
    query(
      ':leave',
      [
        animate(
          '500ms ease-in-out',
          style({ opacity: 0, transform: 'translateX(120%)' })
        ),
      ],
      {
        optional: true,
      }
    ),
    query(':leave', animate('100ms ease-out', style({ display: 'none' })), {
      optional: true,
    }),
    query(
      ':enter',
      [
        animate(
          '500ms ease-in-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ],
      {
        optional: true,
      }
    ),
  ]),
]);
export const fadeAnimationComponent = trigger('fadeAnimationComponent', [
  transition(':enter', [
    style({ position: 'absolute', transform: 'translateX(-120%)' }),
    animate(
      '300ms 100ms',
      style({ position: 'absolute', transform: 'translateX(0)' })
    ),
  ]),
  transition(':leave', [
    animate(
      '500ms 100ms',
      style({
        position: 'absolute',
        transform: 'translateX(-120%)',
      })
    ),
  ]),
]);
