import { extend } from 'vee-validate'
import { required, alpha } from 'vee-validate/dist/rules'

extend('required', {
  ...required,
  message: 'This field is required',
})

extend('alpha', {
  ...alpha,
  message: 'This field must only contain alphabetic characters',
})

// extend('positive', value => {
//   return value >= 0;
// });

// extend('odd', value => {
//   return value % 2 !== 0;
// });

// extend('min', {
//   validate(value, args) {
//     return value.length >= args.length;
//   },
//   params: ['length']
// });
