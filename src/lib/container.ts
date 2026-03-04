import { createContainer, asClass, asValue, InjectionMode } from "awilix";
import { db } from "@/database";
import redis from "@/config/redis";
import { RedisCache } from "@/utils/redis";

// Repositories
import { AcademicLevelRepository } from "@/repositories/academic-level.repository";
import { AttendanceRepository } from "@/repositories/attendance.repository";
import { BuildingRepository } from "@/repositories/building.repository";
import { ClassroomRepository } from "@/repositories/classroom.repository";
import { CourseRepository } from "@/repositories/course.repository";
import { DepartmentRepository } from "@/repositories/department.repository";
import { FacultyRepository } from "@/repositories/faculty.repository";
import { ScheduleRepository } from "@/repositories/schedule.repository";
import { SessionTimeRepository } from "@/repositories/session-time.repository";
import { StudentRepository } from "@/repositories/student.repository";
import { TeacherRepository } from "@/repositories/teacher.repository";
import { TranslationRepository } from "@/repositories/translation.repository";
import { NotificationRepository } from "@/repositories/notification.repository";

// Services
import { AcademicLevelService } from "@/services/academic-level.service";
import { AttendanceService } from "@/services/attendace.service";
import { BuildingService } from "@/services/building.service";
import { ClassroomService } from "@/services/classroom.service";
import { DepartmentService } from "@/services/department.service";
import { FacultyService } from "@/services/faculty.service";
import { ScheduleService } from "@/services/schedule.service";
import { SessionTimeService } from "@/services/session-time.service";
import { StudentService } from "@/services/student.service";
import { TeacherService } from "@/services/teacher.service";
import { TranslationService } from "@/services/translation.service";
import { NotificationService } from "@/services/notification.service";

// WebSocket
import { WebSocketManager } from "@/lib/ws-manager";

export interface ICradle {
  // Infrastructure
  db: typeof db;
  redisClient: typeof redis;
  cache: RedisCache<any>;
  wsManager: WebSocketManager;

  // Repositories
  academicLevelRepository: AcademicLevelRepository;
  attendanceRepository: AttendanceRepository;
  buildingRepository: BuildingRepository;
  classroomRepository: ClassroomRepository;
  courseRepository: CourseRepository;
  departmentRepository: DepartmentRepository;
  facultyRepository: FacultyRepository;
  scheduleRepository: ScheduleRepository;
  sessionTimeRepository: SessionTimeRepository;
  studentRepository: StudentRepository;
  teacherRepository: TeacherRepository;
  translationRepository: TranslationRepository;
  notificationRepository: NotificationRepository;

  // Services
  academicLevelService: AcademicLevelService;
  attendanceService: AttendanceService;
  buildingService: BuildingService;
  classroomService: ClassroomService;
  departmentService: DepartmentService;
  facultyService: FacultyService;
  scheduleService: ScheduleService;
  sessionTimeService: SessionTimeService;
  studentService: StudentService;
  teacherService: TeacherService;
  translationService: TranslationService;
  notificationService: NotificationService;
}

const container = createContainer<ICradle>({
  injectionMode: InjectionMode.CLASSIC,
});

container.register({
  // Infrastructure
  db: asValue(db),
  redisClient: asValue(redis),
  cache: asClass(RedisCache).singleton(),
  wsManager: asClass(WebSocketManager).singleton(),

  // Repositories
  academicLevelRepository: asClass(AcademicLevelRepository).singleton(),
  attendanceRepository: asClass(AttendanceRepository).singleton(),
  buildingRepository: asClass(BuildingRepository).singleton(),
  classroomRepository: asClass(ClassroomRepository).singleton(),
  courseRepository: asClass(CourseRepository).singleton(),
  departmentRepository: asClass(DepartmentRepository).singleton(),
  facultyRepository: asClass(FacultyRepository).singleton(),
  scheduleRepository: asClass(ScheduleRepository).singleton(),
  sessionTimeRepository: asClass(SessionTimeRepository).singleton(),
  studentRepository: asClass(StudentRepository).singleton(),
  teacherRepository: asClass(TeacherRepository).singleton(),
  translationRepository: asClass(TranslationRepository).singleton(),
  notificationRepository: asClass(NotificationRepository).singleton(),

  // Services
  academicLevelService: asClass(AcademicLevelService).singleton(),
  attendanceService: asClass(AttendanceService).singleton(),
  buildingService: asClass(BuildingService).singleton(),
  classroomService: asClass(ClassroomService).singleton(),
  departmentService: asClass(DepartmentService).singleton(),
  facultyService: asClass(FacultyService).singleton(),
  scheduleService: asClass(ScheduleService).singleton(),
  sessionTimeService: asClass(SessionTimeService).singleton(),
  studentService: asClass(StudentService).singleton(),
  teacherService: asClass(TeacherService).singleton(),
  translationService: asClass(TranslationService).singleton(),
  notificationService: asClass(NotificationService).singleton(),
});

export { container };
