import { testimonialsData } from '@/data/testimonials';

export default function Testimonials() {
  const featuredTestimonials = testimonialsData.slice(0, 3);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Guests Say
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what our valued customers have to say 
            about their dining experience at our restaurant.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-800 rounded-lg p-6 shadow-lg"
            >
              <div className="flex items-center mb-4">
                {renderStars(testimonial.rating)}
              </div>
              <blockquote className="text-gray-300 mb-4 leading-relaxed">
                &ldquo;{testimonial.text}&rdquo;
              </blockquote>
              <div className="flex items-center justify-between">
                <cite className="text-white font-semibold not-italic">
                  {testimonial.name}
                </cite>
                {testimonial.source && (
                  <span className="text-gray-400 text-sm capitalize">
                    via {testimonial.source}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}