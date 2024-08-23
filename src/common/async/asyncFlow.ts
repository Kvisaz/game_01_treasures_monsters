type AsyncTask = () => Promise<void>;

/** a lot of async task with cancel function
 *  async operation must be single and last in each AsyncTask callback
 *
 example: const { cancel, run } = asyncFlow([
 async () => console.log("state changes started"),
 () => delay(1000),
 () => delay(1000),
 () => delay(1000),
 async () => console.log("state changes finished")
 ]);
 run().catch(console.warn);
 **/
export function asyncFlow(tasks: AsyncTask[]) {
  let isCancelled = false;
  const cancel = () => isCancelled = true;
  const run = async () => {
    for (let task of tasks) {
      if (isCancelled) {
        console.log("cancelled!");
        return;
      }
      await task();
    }
    console.log("all task are finished!");
  };

  return {
    cancel,
    run
  };
}
