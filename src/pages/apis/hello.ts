/*
 * @Author: zhangyang
 * @Date: 2022-09-04 12:03:18
 * @LastEditTime: 2022-09-04 12:07:18
 * @Description: 
 */
export const get = async () => {
  return new Response(JSON.stringify({
    msg: 'hello world',
  }), {
    status: 200
  })
}