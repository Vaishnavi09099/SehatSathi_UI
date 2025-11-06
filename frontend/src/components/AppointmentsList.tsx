import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Video, Phone, MessageSquare, Star, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { appointmentsAPI, consultationsAPI } from '../services/api';
import { VideoConsultation } from './VideoConsultation';

interface Appointment {
  _id: string;
  doctor: {
    name: string;
    doctorProfile: {
      specialty: string;
    };
  };
  patient: {
    name: string;
  };
  appointmentDate: string;
  timeSlot: string;
  status: string;
  payment: {
    amount: number;
    status: string;
  };
  consultationId: string;
  prescription?: any[];
  rating?: {
    score: number;
    review: string;
  };
}

interface AppointmentsListProps {
  userRole: 'patient' | 'doctor' | 'asha';
}

export function AppointmentsList({ userRole }: AppointmentsListProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [showVideoConsultation, setShowVideoConsultation] = useState(false);
  const [currentConsultation, setCurrentConsultation] = useState<any>(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentsAPI.getAll();
      setAppointments(response.appointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const startConsultation = async (appointment: Appointment) => {
    try {
      const response = await consultationsAPI.start(appointment._id);
      setCurrentConsultation({
        consultationId: response.consultation.roomId,
        appointmentId: appointment._id
      });
      setShowVideoConsultation(true);
    } catch (error) {
      console.error('Error starting consultation:', error);
      toast.error('Failed to start consultation');
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
      await appointmentsAPI.updateStatus(appointmentId, status);
      await loadAppointments();
      toast.success(`Appointment ${status}`);
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment');
    }
  };

  const submitRating = async () => {
    if (!selectedAppointment) return;

    try {
      await appointmentsAPI.addRating(selectedAppointment._id, {
        score: rating,
        review: review.trim() || undefined
      });
      
      await loadAppointments();
      setShowRatingDialog(false);
      setSelectedAppointment(null);
      setRating(5);
      setReview('');
      toast.success('Rating submitted successfully');
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Failed to submit rating');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canStartConsultation = (appointment: Appointment) => {
    const appointmentTime = new Date(`${appointment.appointmentDate} ${appointment.timeSlot}`);
    const now = new Date();
    const timeDiff = appointmentTime.getTime() - now.getTime();
    
    return appointment.status === 'confirmed' && 
           timeDiff <= 15 * 60 * 1000 && // 15 minutes before
           timeDiff >= -30 * 60 * 1000;   // 30 minutes after
  };

  if (showVideoConsultation && currentConsultation) {
    return (
      <VideoConsultation
        consultationId={currentConsultation.consultationId}
        appointmentId={currentConsultation.appointmentId}
        userRole={userRole}
        onEnd={() => {
          setShowVideoConsultation(false);
          setCurrentConsultation(null);
          loadAppointments();
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {userRole === 'patient' ? 'My Appointments' : 'Patient Appointments'}
        </h2>
        <Button onClick={loadAppointments} variant="outline">
          Refresh
        </Button>
      </div>

      {appointments.length === 0 ? (
        <Card className="p-8 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments found</h3>
          <p className="text-gray-600">You don't have any appointments scheduled.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {appointments.map((appointment) => (
            <Card key={appointment._id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {userRole === 'patient' 
                          ? `Dr. ${appointment.doctor.name}`
                          : appointment.patient.name
                        }
                      </h3>
                      <p className="text-gray-600">
                        {appointment.doctor.doctorProfile.specialty}
                      </p>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {new Date(appointment.appointmentDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{appointment.timeSlot}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="w-4 h-4" />
                      <span className="text-sm">₹{appointment.payment.amount}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm">{appointment.consultationId}</span>
                    </div>
                  </div>

                  {appointment.prescription && appointment.prescription.length > 0 && (
                    <div className="mb-4 p-3 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">Prescription Available</h4>
                      <p className="text-sm text-green-700">
                        {appointment.prescription.length} medication(s) prescribed
                      </p>
                    </div>
                  )}

                  {appointment.rating && (
                    <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{appointment.rating.score}/5</span>
                      </div>
                      {appointment.rating.review && (
                        <p className="text-sm text-gray-700">{appointment.rating.review}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  {appointment.status === 'pending' && userRole === 'doctor' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateAppointmentStatus(appointment._id, 'confirmed')}
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateAppointmentStatus(appointment._id, 'cancelled')}
                      >
                        Cancel
                      </Button>
                    </>
                  )}

                  {canStartConsultation(appointment) && (
                    <Button
                      size="sm"
                      onClick={() => startConsultation(appointment)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Start Consultation
                    </Button>
                  )}

                  {appointment.status === 'in-progress' && (
                    <Button
                      size="sm"
                      onClick={() => startConsultation(appointment)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Join Consultation
                    </Button>
                  )}

                  {appointment.status === 'completed' && userRole === 'patient' && !appointment.rating && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setShowRatingDialog(true);
                      }}
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Rate
                    </Button>
                  )}

                  <Button size="sm" variant="ghost">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Rating Dialog */}
      <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate Your Consultation</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`w-8 h-8 ${
                      star <= rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    <Star className="w-full h-full fill-current" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Review (Optional)</label>
              <Textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience..."
                rows={3}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowRatingDialog(false)}>
                Cancel
              </Button>
              <Button onClick={submitRating}>
                Submit Rating
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}