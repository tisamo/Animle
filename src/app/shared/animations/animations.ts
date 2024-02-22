import { trigger, state, style, transition, animate } from '@angular/animations';
 const color = '#7FFF00';
export const fadeInOutAnimation = trigger('fadeInOut', [
  state('true', style({ opacity: 1, transform: 'scale(1)' })), // when shown is true
  state('false', style({ opacity: 0, transform: 'scale(0.5)' })), // when shown is false
  transition('true <=> false', animate('300ms ease-in-out')) // transition between true and false
]);
export const opacity =  trigger('random', [
  state('void', style({  opacity: 0})), // Starting state with 0 opacity
  transition(':enter', [ // Alias for 'void => *', meaning any new element entering the DOM will trigger this animation
    animate('0.5s', style({  opacity: 1})) // Duration of 1 second to fade in to full opacity
  ])
])

export const borderAnim =  trigger('border', [
  state('void', style({  'border-left-color':color, 'border-bottom-color':color })), // Starting state with 0 opacity
  transition(':enter', [ // Alias for 'void => *', meaning any new element entering the DOM will trigger this animation
    animate('3s', style({  'border-left-color':"black", 'border-bottom-color':"black", "border-top-color":'green','border-right-color':color})) // Duration of 1 second to fade in to full opacity
  ])
])
export const slipLeft =  trigger('opacity', [
  state('void', style({  right: "-200px"   })), // Starting state with 0 opacity
  transition(':enter', [ // Alias for 'void => *', meaning any new element entering the DOM will trigger this animation
    animate('0.2s', style({  right: "-50px"})) // Duration of 1 second to fade in to full opacity
  ])
])





