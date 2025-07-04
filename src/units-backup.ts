// app.post("/fix", async (c) => {
//   try {
//     const questions = await (prisma.unit_questions.findMany({}) as Promise<
//       Array<TUnitQuestion>
//     >);

//     const filteredQuestion = questions.filter(
//       (item) =>
//         !["WRITE_THE_SYMBOL_FROM_SOUND"].includes(item.question.data.type)
//     );

//     const fixData = filteredQuestion.map((question) => {
//       let fixQuestion = question;

//       if (isGUESS_THE_SOUND_MEAN(fixQuestion.question.data)) {
//         lodash.set(fixQuestion, "question.data.data.answer", {
//           en: {
//             index: 0,
//             translate: fixQuestion.question.data.data.answer.en,
//           },
//           id: {
//             index: 0,
//             translate: fixQuestion.question.data.data.answer.id,
//           },
//         });

//         lodash.set(
//           fixQuestion,
//           "question.data.data.options",
//           fixQuestion.question.data.data.options.map((item) => ({
//             en: {
//               index: 0,
//               translate: item.en,
//             },
//             id: {
//               index: 0,
//               translate: item.id,
//             },
//           }))
//         );
//       }

//       if (
//         isSORT_THE_MEAN(fixQuestion.question.data) ||
//         isGUESS_THE_SENTENCE_MEAN(fixQuestion.question.data)
//       ) {
//         lodash.set(fixQuestion, "question.data.data.answer", {
//           en: {
//             index: 0,
//             translate: fixQuestion.question.data.data.answer.en,
//           },
//           id: {
//             index: 0,
//             translate: fixQuestion.question.data.data.answer.id,
//           },
//         });

//         lodash.set(
//           fixQuestion,
//           "question.data.data.options",
//           fixQuestion.question.data.data.options.map((item) => ({
//             en: {
//               index: 0,
//               translate: item.en,
//             },
//             id: {
//               index: 0,
//               translate: item.id,
//             },
//           }))
//         );

//         lodash.set(
//           fixQuestion,
//           "question.data.data.question",
//           fixQuestion.question.data.data.question.map(({ mean, ...item }) => ({
//             ...item,
//             translation: mean
//               ? {
//                   en: {
//                     index: 0,
//                     translate: mean.en,
//                   },
//                   id: {
//                     index: 0,
//                     translate: mean.id,
//                   },
//                 }
//               : mean,
//           }))
//         );
//       }

//       if (
//         isWRITE_THE_SYMBOL_FROM_MEAN(fixQuestion.question.data) ||
//         isSORT_THE_SYMBOLS_FROM_MEAN(fixQuestion.question.data) ||
//         isGUESS_THE_SYMBOL_FROM_MEAN(fixQuestion.question.data)
//       ) {
//         lodash.set(
//           fixQuestion,
//           "question.data.data.question",
//           fixQuestion.question.data.data.question.map(({ mean, ...item }) => ({
//             ...item,
//             translation: mean
//               ? {
//                   en: {
//                     index: 0,
//                     translate: mean.en,
//                   },
//                   id: {
//                     index: 0,
//                     translate: mean.id,
//                   },
//                 }
//               : mean,
//           }))
//         );
//       }

//       return fixQuestion;
//     });

//     const res = await Promise.all(
//       fixData.map((item) => {
//         const promise = prisma.unit_questions.update({
//           data: {
//             question: item.question,
//           },
//           where: {
//             id: item.id,
//           },
//         });

//         return promise;
//       })
//     );

//     return c.json(res);
//   } catch (error) {
//     console.log(error);
//     return c.json({ error });
//   }
// });