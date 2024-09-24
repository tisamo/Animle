import { trigger, state, style, transition, animate } from '@angular/animations';
 const color = '#7FFF00';
export const fadeInOutAnimation = trigger('fadeInOut', [
  state('true', style({ opacity: 1, transform: 'scale(1)' })),
  state('false', style({ opacity: 0, transform: 'scale(0.5)' })),
  transition('true <=> false', animate('300ms ease-in-out'))
]);
export const opacity =  trigger('random', [
  state('void', style({  opacity: 0})),
  transition(':enter', [
    animate('0.5s', style({  opacity: 1}))
  ])
])

export const borderAnim =  trigger('border', [
  state('void', style({  'border-left-color':color, 'border-bottom-color':color })),
  transition(':enter', [
    animate('3s', style({  'border-left-color':"black", 'border-bottom-color':"black", "border-top-color":'green','border-right-color':color}))
  ])
])
export const slipLeft =  trigger('opacity', [
  state('void', style({  right: "-200px"   })),
  transition(':enter', [
    animate('0.2s', style({  right: "-50px"}))
  ])
])





