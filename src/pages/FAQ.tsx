import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "How long does it take to get my account?",
      answer: "Most accounts are delivered within 6-24 hours. Express orders are completed within 6 hours. We'll notify you via email once your account is ready."
    },
    {
      question: "How do I make payment?",
      answer: "We accept bKash, Nagad, and Rocket. Send money to our number (01XXXXXXXXX) and enter the transaction ID in the order form."
    },
    {
      question: "Is my account secure?",
      answer: "Yes! We use professional account creation methods and provide you with full ownership. Change the password immediately after receiving your account for maximum security."
    },
    {
      question: "What if I don't receive my account?",
      answer: "If you don't receive your account within the promised time, contact our support team. We offer full refunds if we cannot deliver as promised."
    },
    {
      question: "Can I change my account details later?",
      answer: "Yes, once you receive the account, you have full control. You can change the password, profile information, and other settings as needed."
    },
    {
      question: "Do you provide customer support?",
      answer: "Yes! We provide 24/7 customer support via email and WhatsApp. Premium customers get priority support with faster response times."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major mobile payment services in Bangladesh: bKash, Nagad, and Rocket. Cash on delivery is not available for security reasons."
    },
    {
      question: "Can I order multiple accounts?",
      answer: "Yes, you can order multiple accounts. Please place separate orders for each account to ensure proper tracking and delivery."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground">
            Find answers to common questions about our service
          </p>
        </div>

        <Card className="bg-gradient-card border-border p-8">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-border">
                <AccordionTrigger className="text-left text-foreground hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>

        <div className="mt-12 text-center">
          <Card className="bg-gradient-card border-border p-6">
            <h3 className="text-xl font-bold text-foreground mb-4">
              Still have questions?
            </h3>
            <p className="text-muted-foreground mb-4">
              Contact our support team for personalized assistance
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="text-center">
                <p className="font-medium text-foreground">Email Support</p>
                <p className="text-primary">support@playpoint.com</p>
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">WhatsApp</p>
                <p className="text-primary">+880 1XXXXXXXXX</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FAQ;