import { Injectable } from '@nestjs/common';
import { AzureChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';

@Injectable()
export class RagService {
  model: AzureChatOpenAI;

  constructor() {
    this.model = new AzureChatOpenAI({
      azureOpenAIApiKey: process.env.API_KEY,
      model: process.env.MODEL,
      azureOpenAIApiInstanceName: process.env.INSTANCE,
      azureOpenAIApiDeploymentName: process.env.DEPLOYMENT,
      azureOpenAIApiVersion: process.env.API_VERSION,
    });
  }

  async get(objective: string, noOfKeyResultsWant: number) {
    const promptTemplate = ChatPromptTemplate.fromMessages([
      [
        'system',
        'Generate single keyResults object for user given objective. key result must contain only following properties: title (must be short and just only of max 3-5 word(s)), metric (what metrics used in keyresult), and initial, completed and target must be number. ',
      ],
      [
        'user',
        '{text} Give me keyResults of give objective in the form of only json string. Important Note: Dont give me other explanation or anything, Make sure that you generate output must contain these keys name only (title, initialValue, targetValue, currentValue, metric) and i just want json string only not in md format not in any other format only in json string text. Must follow this: Dont give me ```json``` i only want json string of data and give exact only and only ' +
          noOfKeyResultsWant +
          ' different key-results json string-objects as mentioned in above in array form even if there only one keyresults then also in array.',
      ],
    ]);

    console.log(
      '{text} Give me keyResults of give objective in the form of only json string. Important Note: Dont give me other explanation or anything, Make sure that you generate output must contain these keys name only (title, initialValue, targetValue, currentValue, metric) and i just want json string only not in md format not in any other format only in json string text. Must follow this: Dont give me ```json``` i only want json string of data and give exact only and only ' +
        noOfKeyResultsWant +
        ' different key-results json string-objects as mentioned in above in array form even if there only one keyresults then also in array.',
    );

    const promptValue = await promptTemplate.invoke({
      text: objective,
    });

    const response = await this.model.invoke(promptValue);
    return JSON.parse(response.content as string);
  }
}
