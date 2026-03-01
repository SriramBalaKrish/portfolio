import { AfterViewInit, Component, HostListener, signal } from '@angular/core';

type SectionId = 'about' | 'skills' | 'experience';
type HeroParticle = {
  id: number;
  size: number;
  startX: number;
  driftX: number;
  duration: number;
  delay: number;
  opacity: number;
};

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit {
  private readonly contactEmail = 'sriram.balakrishnan@example.com';
  private readonly whatsappChatLink = 'https://wa.me/917259678593';
  private readonly sectionIds: SectionId[] = ['about', 'skills', 'experience'];
  protected readonly heroParticles = this.createHeroParticles(42);
  protected readonly skillsParticles = this.createSkillsParticles(36);
  protected readonly activeSection = signal<SectionId>('about');
  protected readonly isContactOpen = signal(false);
  protected readonly isMenuOpen = signal(false);

  ngAfterViewInit(): void {
    this.updateActiveSection();
  }

  protected openContactModal(): void {
    this.isContactOpen.set(true);
  }

  protected closeContactModal(): void {
    this.isContactOpen.set(false);
  }

  protected toggleMobileMenu(): void {
    this.isMenuOpen.update((state) => !state);
  }

  protected closeMobileMenu(): void {
    this.isMenuOpen.set(false);
  }

  protected submitContact(name: string, phone: string, email: string): void {
    const subject = encodeURIComponent('Portfolio Contact Request');
    const body = encodeURIComponent(
      `Hi Sriram,\n\nName: ${name || '-'}\nPhone: ${phone || '-'}\nEmail: ${email || '-'}`
    );
    const mailto = `mailto:${this.contactEmail}?subject=${subject}&body=${body}`;

    if (typeof window !== 'undefined') {
      window.location.href = mailto;
    }

    this.isContactOpen.set(false);
  }

  protected openWhatsApp(): void {
    if (typeof window !== 'undefined') {
      window.open(this.whatsappChatLink, '_blank', 'noopener,noreferrer');
    }
    this.isContactOpen.set(false);
  }

  protected isSectionActive(sectionId: SectionId): boolean {
    return this.activeSection() === sectionId;
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.isContactOpen()) {
      this.isContactOpen.set(false);
    }
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  protected updateActiveSection(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    if (window.innerWidth > 840 && this.isMenuOpen()) {
      this.isMenuOpen.set(false);
    }

    const marker = window.scrollY + 180;
    let currentSection: SectionId = 'about';

    for (const sectionId of this.sectionIds) {
      const section = document.getElementById(sectionId);
      if (section && section.offsetTop <= marker) {
        currentSection = sectionId;
      }
    }

    this.activeSection.set(currentSection);
  }

  private createHeroParticles(count: number): HeroParticle[] {
    return Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      size: this.rand(2, 7),
      startX: this.rand(0, 100),
      driftX: this.rand(-20, 20),
      duration: this.rand(9000, 18000),
      delay: this.rand(0, 9000),
      opacity: this.rand(20, 70) / 100
    }));
  }

  private createSkillsParticles(count: number): HeroParticle[] {
    return Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      size: this.rand(2, 6),
      startX: this.rand(0, 100),
      driftX: this.rand(-26, 26),
      duration: this.rand(11000, 22000),
      delay: this.rand(0, 9000),
      opacity: this.rand(12, 35) / 100
    }));
  }

  private rand(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
