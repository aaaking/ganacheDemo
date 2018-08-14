import fetch from '@/utils/fetch';

export function list(data) {
  return fetch({
    url: '/dollars/testzzh',
    methods: 'get',
    data
  });
}
