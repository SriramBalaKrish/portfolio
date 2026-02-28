import { AfterViewInit, Component, HostListener, signal } from '@angular/core';

type SectionId = 'about' | 'skills' | 'experience';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit {
  private readonly contactEmail = 'sriram.balakrishnan@example.com';
  private readonly sectionIds: SectionId[] = ['about', 'skills', 'experience'];
  protected readonly activeSection = signal<SectionId>('about');
  protected readonly isContactOpen = signal(false);

  ngAfterViewInit(): void {
    this.updateActiveSection();
  }

  protected openContactModal(): void {
    this.isContactOpen.set(true);
  }

  protected closeContactModal(): void {
    this.isContactOpen.set(false);
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
}
