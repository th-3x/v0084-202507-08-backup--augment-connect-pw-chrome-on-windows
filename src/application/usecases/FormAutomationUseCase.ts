import { IAutomationService } from '../../domain/services/IAutomationService';
import { IBrowserRepository } from '../../domain/repositories/IBrowserRepository';
import { UseCaseResult, FormData } from '../../shared/types';

export class FormAutomationUseCase {
  constructor(
    private automationService: IAutomationService,
    private browserRepository: IBrowserRepository
  ) {}

  async execute(sessionId: string): Promise<UseCaseResult<boolean>> {
    console.log('\n=== Form Automation Use Case ===');
    
    try {
      // Example: Fill a contact form on a demo site (using a more reliable demo site)
      const url = 'https://httpbin.org/forms/post';
      
      const formData: FormData = {
        'input[name="custname"]': 'John Doe',
        'input[name="custtel"]': '123-456-7890',
        'input[name="custemail"]': 'john.doe@example.com',
        'textarea[name="comments"]': 'This is a test message from Playwright automation.'
      };

      console.log(`Starting form automation for: ${url}`);
      const result = await this.automationService.fillForm(
        sessionId, 
        url, 
        formData
        // Note: Not submitting to avoid actual form submission on demo site
      );
      
      if (result.success) {
        console.log('✅ Form automation completed successfully');
        console.log(`Execution time: ${result.executionTime}ms`);
        console.log('Form fields filled:', Object.keys(formData).join(', '));
      } else {
        console.log('❌ Form automation failed:', result.error);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error in form automation use case';
      console.error('Form automation use case error:', errorMessage);
      
      return {
        success: false,
        error: errorMessage,
        executionTime: 0,
        timestamp: new Date()
      };
    }
  }
}
