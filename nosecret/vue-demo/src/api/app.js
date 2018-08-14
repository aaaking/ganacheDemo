import fetch from '@/utils/fetch';

// export default {
//   list: () => fetch({
//     url: '/dollars/testzzh',
//     methods: 'get'
//   }),
// }

export default {
  list: () => fetch.get('/dollars/testzzh')
}
